import { cookies } from "next/headers";

/**
 * Check if user is logged in by verifying auth token in cookies
 * Use this in server components or server actions
 */
export async function isUserLoggedIn(): Promise<boolean> {
	const cookieStore = await cookies();
	return !!cookieStore.get("authToken")?.value;
}

/**
 * Get the auth token from cookies
 */
export async function getAuthToken(): Promise<string | null> {
	const cookieStore = await cookies();
	return cookieStore.get("authToken")?.value || null;
}

/**
 * Set auth token in cookies (use this after successful login)
 */
export async function setAuthToken(token: string): Promise<void> {
	const cookieStore = await cookies();
	cookieStore.set("authToken", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 60 * 60 * 24 * 7, // 7 days
		path: "/",
	});
}

/**
 * Clear auth token from cookies (use this for logout)
 */
export async function clearAuthToken(): Promise<void> {
	const cookieStore = await cookies();
	cookieStore.delete("authToken");
}
