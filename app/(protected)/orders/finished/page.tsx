"use client";

import React, { useState, useEffect } from "react";
import { Order } from "@lib/orders";
import OrderCard from "../components/OrderCard";

export default function ActiveOrdersPage() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const response = await fetch("/api/orders/finished");
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
					<p className="text-gray-600">
						У вас нет завершенных заказов
					</p>
				</div>
			) : (
				<div className="mt-6 space-y-4">
					{orders.map((order) => (
						<OrderCard order={order} key={order.id} />
					))}
				</div>
			)}
		</div>
	);
}
