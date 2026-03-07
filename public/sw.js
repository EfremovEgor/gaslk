self.addEventListener("push", function (event) {
	if (event.data) {
		const data = event.data.json();
		const options = {
			body: data.body,
			icon: data.icon || "/favicon.png",
			badge: "/favicon.png",
			vibrate: [100, 50, 100],
			data: {
				// IMPORTANT: Save the URL from the push payload here
				url: data.url || "/",
				dateOfArrival: Date.now(),
				primaryKey: "2",
			},
		};
		event.waitUntil(
			self.registration.showNotification(data.title, options),
		);
	}
});
// Browsers require a fetch handler to trigger the 'Add to Home Screen' prompt
self.addEventListener("fetch", (event) => {});
self.addEventListener("notificationclick", function (event) {
	const targetUrl = event.notification.data.url || "/";

	event.notification.close();

	event.waitUntil(
		clients.matchAll({ type: "window" }).then((clientList) => {
			for (const client of clientList) {
				if (client.url === targetUrl && "focus" in client)
					return client.focus();
			}
			// Otherwise, open a new one
			if (clients.openWindow) return clients.openWindow(targetUrl);
		}),
	);
});
