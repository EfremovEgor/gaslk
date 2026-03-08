"use server";
import { cookies } from "next/headers";
import redis from "@lib/redis";
import { prisma } from "@lib/prisma";

/**
 * Check if user is logged in by verifying auth token in cookies and Redis session
 * Use this in server components or server actions
 */
export async function isUserLoggedIn(): Promise<boolean> {
	const cookieStore = await cookies();
	const token = cookieStore.get("authToken")?.value;
	if (!token) return false;
	const userId = await redis.get(`session:${token}`);
	return !!userId;
}

/**
 * Get the auth token from cookies
 */
export async function getAuthToken(): Promise<string | null> {
	const cookieStore = await cookies();
	return cookieStore.get("authToken")?.value || null;
}

/**
 * Try to load the current user from the session cookie/redis
 */
export async function getCurrentUser() {
	const token = await getAuthToken();
	if (!token) return null;
	const userId = await redis.get(`session:${token}`);
	if (!userId) return null;
	return prisma.user.findUnique({ where: { id: userId } });
}

/**
 * Set auth token in cookies (use this after successful login)
 */
export async function setAuthToken(token: string): Promise<void> {
	const cookieStore = await cookies();
	cookieStore.set("authToken", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 60 * 60 * 24 * 7, // 7 days
		path: "/",
	});
}

/**
 * Clear auth token from cookies (use this for logout)
 */
export async function clearAuthToken(): Promise<void> {
	const cookieStore = await cookies();
	cookieStore.delete("authToken");
}
