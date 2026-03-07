"use server";

import { redirect } from "next/navigation";
import { clearAuthToken } from "./auth";

export async function logout() {
	await clearAuthToken();
	redirect("/login");
}
