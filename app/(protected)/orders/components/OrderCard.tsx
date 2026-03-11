import Card from "@components/ui/Card";
import { Order } from "@lib/orders";
import React from "react";
import OrderStatusBadge from "./OrderStatusBadge";

const OrderCard = ({ order }: { order: Order }) => {
	return (
		<Card key={order.id}>
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
				<OrderStatusBadge status={order.status} />
				<span className="text-sm mt-2 ">Заказ {order.id}</span>
				<span className="text-sm font-medium text-gray-500">
					От {new Date(order.createdAt).toLocaleDateString("ru-RU")}
				</span>
			</div>

			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
				<span className="text-sm text-gray-500">
					Адрес: {order.deliveryAddress}
				</span>
				<span className="text-sm text-gray-500">
					Доставка:{" "}
					{new Date(order.desiredDeliveryDate).toLocaleDateString(
						"ru-RU",
					)}
				</span>
			</div>

			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-3 pt-3 border-t border-gray-100">
				<span className="text-lg font-bold text-gray-900">
					{order.amount.toFixed(2)} ₽
				</span>
			</div>
		</Card>
	);
};

export default OrderCard;
