"use client";
import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";

const links = [
	{
		href: "/account",
		icon: "material-symbols:person-outline-rounded",
		label: "Аккаунт",
	},
	{
		href: "/orders/active",
		icon: "mingcute:shopping-cart-2-line",
		label: "Текущие",
	},
	{
		href: "/orders/finished",
		icon: "tabler:clipboard-check",
		label: "Завершенные",
	},
	{
		href: "/orders/completed",
		icon: "mdi:fire",
		label: "Статистика",
	},
	{ href: "/orders/create", icon: "mdi:plus", label: "Новый" },
];

const Navbar = () => {
	const pathname = usePathname();
	return (
		<nav className="fixed bottom-0 left-0 w-full bg-navbar-background shadow-inner px-2 py-2">
			<div className="flex justify-around">
				{links.map((l) => {
					const active = pathname === l.href;
					return (
						<Link
							key={l.href}
							href={l.href}
							className={`flex flex-col items-center text-xs ${
								active ? "text-blue-500" : "text-gray-700"
							}`}
						>
							<Icon
								className={`text-4xl ${active ? "text-blue-500" : ""}`}
								icon={l.icon}
							/>
							<span className="text-xs text-center mt-1">
								{l.label}
							</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
};

export default Navbar;
