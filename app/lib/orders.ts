export type OrderStatus =
	| "pending"
	| "confirmed"
	| "shipped"
	| "delivered"
	| "cancelled"
	| "completed";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
	pending: "В обработке",
	confirmed: "Подтвержден",
	shipped: "Отправлен",
	delivered: "Доставлен",
	cancelled: "Отменен",
	completed: "Завершен",
};

export interface Order {
	id: string;
	createdAt: string;
	status: OrderStatus;
	desiredDeliveryDate: string;
	deliveryAddress: string;
	amount: number;
}
