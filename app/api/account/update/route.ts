import { NextResponse } from "next/server";
import { getCurrentUser } from "@lib/auth/auth";
import { prisma } from "@lib/prisma";
import crypto from "crypto";
import { promisify } from "util";

const scrypt = promisify(crypto.scrypt);

async function hashPassword(password: string): Promise<string> {
    const salt = crypto.randomBytes(16).toString("hex");
    const derived = (await scrypt(password, salt, 64)) as Buffer;
    return `${salt}:${derived.toString("hex")}`;
}

export async function POST(request: Request) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    try {
        const body = await request.json();
        const {
            firstName,
            lastName,
            middleName,
            phone,
            password,
            addresses,
        } = body;

        const updates: Record<string, unknown> = {};
        if (firstName !== undefined) updates.firstName = firstName;
        if (lastName !== undefined) updates.lastName = lastName;
        if (middleName !== undefined) updates.middleName = middleName;
        if (phone !== undefined) updates.phoneNumber = phone;
        if (password) {
            updates.password = await hashPassword(password);
        }

        await prisma.user.update({
            where: { id: user.id },
            data: updates,
        });

        if (Array.isArray(addresses)) {
            // simple strategy: delete existing and recreate
            await prisma.address.deleteMany({ where: { userId: user.id } });
            const createData = addresses
                .filter((a: string) => a && a.trim())
                .map((addr: string) => ({ address: addr, userId: user.id }));
            if (createData.length) {
                await prisma.address.createMany({ data: createData });
            }
        }

        return NextResponse.json({ ok: true });
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Update failed";
        return NextResponse.json(
            { error: message },
            { status: 400 },
        );
    }
}
