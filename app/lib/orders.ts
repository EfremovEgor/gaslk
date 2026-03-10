export type OrderStatus =
	| "pending"
	| "confirmed"
	| "shipped"
	| "delivered"
	| "cancelled";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
	pending: "В обработке",
	confirmed: "Подтвержден",
	shipped: "Отправлен",
	delivered: "Доставлен",
	cancelled: "Отменен",
};
