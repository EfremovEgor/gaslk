"use client";

import React, { useState, useEffect } from "react";
import { ORDER_STATUS_LABELS, OrderStatus } from "@lib/orders";
import OrderStatusBadge from "../components/OrderStatusBadge";

interface Order {
	id: string;
	createdAt: string;
	status: OrderStatus;
	desiredDeliveryDate: string;
	deliveryAddress: string;
	amount: number;
}

export default function ActiveOrdersPage() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const response = await fetch("/api/orders/active");
				const data = await response.json();

				if (response.ok) {
					setOrders(data.orders);
				} else {
					setError(data.error || "Ошибка при загрузке заказов");
				}
			} catch (err: unknown) {
				setError("Ошибка при подключении к серверу");
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, []);

	if (loading) {
		return (
			<div className="container mx-auto">
				<h1 className="text-3xl font-bold">Текущие заказы</h1>
				<p className="mt-4">Загрузка...</p>
			</div>
		);
	}

	return (
		<div className="container mx-auto">
			<h1 className="text-3xl font-bold">Текущие заказы</h1>

			{error && (
				<div className="mt-4 rounded-md bg-red-50 p-4 text-red-700">
					{error}
				</div>
			)}

			{orders.length === 0 ? (
				<div className="mt-6 rounded-md bg-gray-50 p-8 text-center">
					<p className="text-gray-600">У вас нет активных заказов</p>
				</div>
			) : (
				<div className="mt-6 space-y-4">
					{orders.map((order) => (
						<div
							key={order.id}
							className="rounded-md border border-gray-200 bg-white p-4 shadow-sm"
						>
							<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
								<OrderStatusBadge status={order.status} />
								<span className="text-sm mt-2 text-gray-500">
									Заказ #{order.id.slice(0, 8)}...
								</span>
								<span className="text-sm font-medium">
									{new Date(
										order.createdAt,
									).toLocaleDateString("ru-RU")}
								</span>
							</div>

							<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
								<span className="text-sm text-gray-500">
									Адрес: {order.deliveryAddress}
								</span>
								<span className="text-sm text-gray-500">
									Доставка:{" "}
									{new Date(
										order.desiredDeliveryDate,
									).toLocaleDateString("ru-RU")}
								</span>
							</div>

							<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-3 pt-3 border-t border-gray-100">
								<span className="text-lg font-bold text-gray-900">
									{order.amount.toFixed(2)} ₽
								</span>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
