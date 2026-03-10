"use server";

import { redirect } from "next/navigation";
import { clearAuthToken, setAuthToken } from "./auth";
import redis from "@lib/redis";
import { prisma } from "@lib/prisma";
import crypto from "crypto";
import { promisify } from "util";

const scrypt = promisify(crypto.scrypt);

async function hashPassword(password: string): Promise<string> {
	const salt = crypto.randomBytes(16).toString("hex");
	const derived = (await scrypt(password, salt, 64)) as Buffer;
	return `${salt}:${derived.toString("hex")}`;
}

async function verifyPassword(
	password: string,
	stored: string,
): Promise<boolean> {
	const [salt, key] = stored.split(":");
	const derived = (await scrypt(password, salt, 64)) as Buffer;
	return key === derived.toString("hex");
}

/**
 * Register user
 * @param email - User email address
 * @param password - User password (will be hashed before
 * storing in DB)
 */
export async function register(email: string, password: string) {
	email = email.trim().toLowerCase();
	if (!email || !password) {
		throw new Error("Email and password are required");
	}

	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) {
		throw new Error("Email already registered");
	}

	const hashed = await hashPassword(password);
	const user = await prisma.user.create({
		data: { email, password: hashed },
	});

	// automatically log the user in by creating a session
	const token = crypto.randomUUID();
	const key = `session:${token}`;
	await redis.set(key, user.id, "EX", 60 * 60 * 24 * 7);
	await setAuthToken(token);

	return { user, token };
}

/**
 * Authenticate a user, create a session in Redis and set auth cookie.
 */
export async function login(email: string, password: string) {
	email = email.trim().toLowerCase();
	if (!email || !password) {
		throw new Error("Email and password are required");
	}
	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) {
		throw new Error("Invalid credentials");
	}
	const ok = await verifyPassword(password, user.password);
	if (!ok) {
		throw new Error("Invalid credentials");
	}

	const token = crypto.randomUUID();
	const key = `session:${token}`;
	await redis.set(key, user.id, "EX", 60 * 60 * 24 * 7);

	await setAuthToken(token);
	return { user, token };
}

export async function logout() {
	await clearAuthToken();
	redirect("/login");
}
