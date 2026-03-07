"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);
	const [showPrompt, setShowPrompt] = useState(false);

	useEffect(() => {
		const handler = (e: Event) => {
			// Prevent the browser from showing the default install prompt
			// Store the event for later use
			setDeferredPrompt(e as BeforeInstallPromptEvent);
			// Show your custom install prompt
			setShowPrompt(true);
		};

		window.addEventListener("beforeinstallprompt", handler);

		// Handle app installed
		const handleAppInstalled = () => {
			setShowPrompt(false);
			setDeferredPrompt(null);
		};

		window.addEventListener("appinstalled", handleAppInstalled);

		return () => {
			window.removeEventListener("beforeinstallprompt", handler);
			window.removeEventListener("appinstalled", handleAppInstalled);
		};
	}, []);

	const handleInstall = async () => {
		if (!deferredPrompt) return;

		// Show the prompt
		deferredPrompt.prompt();

		// Wait for the user to respond
		const { outcome } = await deferredPrompt.userChoice;
		console.log(`User response to the install prompt: ${outcome}`);

		// Clear the stored prompt
		setDeferredPrompt(null);
		setShowPrompt(false);
	};

	const handleDismiss = () => {
		setShowPrompt(false);
	};

	if (!showPrompt || !deferredPrompt) {
		return null;
	}

	return (
		<div
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				backgroundColor: "#ffffff",
				boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
				padding: "16px",
				zIndex: 1000,
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				gap: "16px",
			}}
		>
			<div>
				<p style={{ margin: 0, fontWeight: "bold" }}>
					Установить приложение?
				</p>
				<p
					style={{
						margin: "4px 0 0 0",
						fontSize: "14px",
						color: "#666",
					}}
				>
					Добавьте приложение на главный экран для быстрого доступа
				</p>
			</div>
			<div style={{ display: "flex", gap: "8px" }}>
				<button
					onClick={handleDismiss}
					style={{
						padding: "8px 16px",
						border: "1px solid #ccc",
						borderRadius: "4px",
						backgroundColor: "#f5f5f5",
						cursor: "pointer",
						fontSize: "14px",
					}}
				>
					Позже
				</button>
				<button
					onClick={handleInstall}
					style={{
						padding: "8px 16px",
						border: "none",
						borderRadius: "4px",
						backgroundColor: "#007AFF",
						color: "#ffffff",
						cursor: "pointer",
						fontSize: "14px",
						fontWeight: "bold",
					}}
				>
					Установить
				</button>
			</div>
		</div>
	);
}
