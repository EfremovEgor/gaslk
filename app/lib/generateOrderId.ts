export function generateOrderId(): string {
	const segment1 = Math.floor(10000 + Math.random() * 89999);
	const segment2 = Math.floor(10000 + Math.random() * 89999);

	return `GA-${segment1}-${segment2}`;
}

export function isValidOrderIdFormat(id: string): boolean {
	const pattern = /^GA-\d{3}\d{2}-\d{5}$/;
	return pattern.test(id);
}
