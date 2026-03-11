/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getCurrentUser } from "@lib/auth/auth";
import { prisma } from "@lib/prisma";
import { generateOrderId, isValidOrderIdFormat } from "@lib/generateOrderId";

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
		const {
			gasQuantity,
			addressId,
			newAddress,
			deliveryDate,
			totalPrice,
			contactFirstName,
			contactPhone,
		} = body;

		if (!gasQuantity || !deliveryDate) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		if (!addressId && !newAddress) {
			return NextResponse.json(
				{
					error: "Пожалуйста, выберите адрес доставки или введите новый",
				},
				{ status: 400 },
			);
		}

		if (addressId && newAddress) {
			return NextResponse.json(
				{
					error: "Нельзя использовать и существующий, и новый адрес одновременно",
				},
				{ status: 400 },
			);
		}

		if (!contactFirstName?.trim() || !contactPhone?.trim()) {
			return NextResponse.json(
				{ error: "Контактные данные обязательны" },
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
				{ error: "Дата отправки не может быть в прошлом" },
				{ status: 400 },
			);
		}

		let deliveryAddress = "";

		if (addressId) {
			const address = await prisma.address.findUnique({
				where: { id: addressId, userId: user.id },
			});

			if (!address) {
				return NextResponse.json(
					{ error: "Invalid address" },
					{ status: 400 },
				);
			}

			deliveryAddress = address.address;
		} else if (newAddress) {
			deliveryAddress = newAddress;
		}

		// Generate a unique order ID
		let id: string = generateOrderId();
		let isUnique = false;
		let attempts = 0;
		const maxAttempts = 10;

		while (!isUnique && attempts < maxAttempts) {
			id = generateOrderId();

			// Validate format
			if (!isValidOrderIdFormat(id)) {
				attempts++;
				continue;
			}

			// Check if ID already exists in database
			const existingOrder = await prisma.order.findUnique({
				where: { id },
			});

			if (!existingOrder) {
				isUnique = true;
			}

			attempts++;
		}

		if (!isUnique) {
			return NextResponse.json(
				{
					error: "Не удалось сгенерировать уникальный ID заказа. Попробуйте снова.",
				},
				{ status: 500 },
			);
		}

		const order = await prisma.order.create({
			data: {
				status: "pending",
				desiredDeliveryDate: selectedDate,
				deliveryAddress,
				amount: totalPrice,
				userId: user.id,
				contactFirstName,
				contactPhone,
				id: id,
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
