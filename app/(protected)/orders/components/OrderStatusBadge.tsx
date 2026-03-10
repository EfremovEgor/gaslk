import { ORDER_STATUS_LABELS, OrderStatus } from "@/app/lib/orders";
import React from "react";
import clsx from "clsx";

const OrderStatusBadge = ({
	status,
	className,
}: {
	status: OrderStatus;
	className?: string;
}) => {
	const getBadgeClasses = (status: OrderStatus) => {
		switch (status) {
			case "pending":
				return "bg-gray-100 text-gray-800";
			case "confirmed":
				return "bg-yellow-100 text-yellow-800";
			case "shipped":
				return "bg-blue-100 text-blue-800";
			case "delivered":
				return "bg-purple-100 text-purple-800";
			case "cancelled":
				return "bg-red-100 text-red-800";
			case "completed":
				return "bg-green-100 text-green-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<span
			className={clsx(
				`w-fit items-center px-2.5 text-center py-0.5 rounded-full text-xs font-medium ${getBadgeClasses(status)}`,
				className,
			)}
		>
			{ORDER_STATUS_LABELS[status]}
		</span>
	);
};

export default OrderStatusBadge;
