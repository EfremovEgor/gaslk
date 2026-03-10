"use server";

import { getCurrentUser } from "@lib/auth/auth";
import { prisma } from "@lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import crypto from "crypto";
import { promisify } from "util";

const scrypt = promisify(crypto.scrypt);

async function hashPassword(password: string): Promise<string> {
	const salt = crypto.randomBytes(16).toString("hex");
	const derived = (await scrypt(password, salt, 64)) as Buffer;
	return `${salt}:${derived.toString("hex")}`;
}

export async function getUserData() {
	const user = await getCurrentUser();
	if (!user) redirect("/login");

	const addresses = await prisma.address.findMany({
		where: { userId: user.id },
	});
	return {
		firstName: user.firstName || "",
		lastName: user.lastName || "",
		middleName: user.middleName || "",
		phoneNumber: user.phoneNumber || "",
		email: user.email,
		addresses: addresses,
	};
}

export async function updateUser(formData: FormData) {
	const user = await getCurrentUser();
	if (!user) throw new Error("Not authenticated");

	const firstName = formData.get("firstName") as string;
	const lastName = formData.get("lastName") as string;
	const middleName = formData.get("middleName") as string;
	const phone = formData.get("phone") as string;
	const password = formData.get("password") as string;
	const addresses = formData.getAll("addresses") as string[];

	if (!firstName?.trim()) {
		throw new Error("Имя не должно быть пустым");
	}
	if (!lastName?.trim()) {
		throw new Error("Фамилия не должна быть пустой");
	}
	if (!phone?.trim()) {
		throw new Error("Телефон не должен быть пустым");
	}

	const phonePattern = /^\+?[0-9\-\s]{7,20}$/;
	if (!phonePattern.test(phone)) {
		throw new Error("Неверный формат телефона");
	}

	if (password && password.trim().length < 6) {
		throw new Error("Пароль должен содержать минимум 6 символов");
	}

	const nonEmptyAddresses = addresses.filter((a) => a?.trim());
	if (nonEmptyAddresses.length === 0) {
		throw new Error("Добавьте хотя бы один адрес");
	}

	const updates: Record<string, unknown> = {
		firstName,
		lastName,
		middleName,
		phoneNumber: phone,
	};

	if (password) {
		updates.password = await hashPassword(password);
	}

	await prisma.user.update({
		where: { id: user.id },
		data: updates,
	});

	await prisma.address.deleteMany({ where: { userId: user.id } });
	const createData = addresses
		.filter((a) => a && a.trim())
		.map((addr) => ({ address: addr, userId: user.id }));
	if (createData.length) {
		await prisma.address.createMany({ data: createData });
	}

	revalidatePath("/account");
}
