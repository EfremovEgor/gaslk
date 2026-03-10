/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getCurrentUser } from "@lib/auth/auth";
import { prisma } from "@lib/prisma";

export async function POST(request: Request) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		const body = await request.json();
		const { gasQuantity, addressId, deliveryDate, totalPrice } = body;

		if (!gasQuantity || !addressId || !deliveryDate) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		const quantity = parseFloat(gasQuantity);
		if (isNaN(quantity) || quantity <= 0) {
			return NextResponse.json(
				{ error: "Invalid gas quantity" },
				{ status: 400 },
			);
		}

		const selectedDate = new Date(deliveryDate);
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		tomorrow.setHours(0, 0, 0, 0);

		if (selectedDate < tomorrow) {
			return NextResponse.json(
				{ error: "Delivery date cannot be in the past" },
				{ status: 400 },
			);
		}

		const address = await prisma.address.findUnique({
			where: { id: addressId, userId: user.id },
		});

		if (!address) {
			return NextResponse.json(
				{ error: "Invalid address" },
				{ status: 400 },
			);
		}

		const order = await prisma.order.create({
			data: {
				status: "pending",
				desiredDeliveryDate: selectedDate,
				deliveryAddress: address.address,
				amount: totalPrice,
				userId: user.id,
			},
		});

		return NextResponse.json({ ok: true, order });
	} catch (err: any) {
		return NextResponse.json(
			{ error: err?.message || "Failed to create order" },
			{ status: 500 },
		);
	}
}
