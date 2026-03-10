/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getCurrentUser } from "@lib/auth/auth";
import { prisma } from "@lib/prisma";

export async function GET() {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		const orders = await prisma.order.findMany({
			where: {
				userId: user.id,
				status: {
					in: ["pending", "confirmed", "shipped"],
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return NextResponse.json({ orders });
	} catch (err: any) {
		return NextResponse.json(
			{ error: err?.message || "Failed to fetch orders" },
			{ status: 500 },
		);
	}
}
