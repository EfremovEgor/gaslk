import { NextRequest, NextResponse } from "next/server";
import { clearAuthToken } from "@lib/auth/auth";

export function proxy(request: NextRequest) {
	const pathname = request.nextUrl.pathname;
	if (pathname == "/")
		return NextResponse.redirect(new URL("/login", request.url));
	const authToken = request.cookies.get("authToken")?.value;
	const isLoggedIn = !!authToken;

	const protectedRoutes = ["/account", "/orders"];
	const isProtectedRoute = protectedRoutes.some((route) =>
		pathname.startsWith(route),
	);

	const publicAuthRoutes = ["/login", "/registration"];
	const isPublicAuthRoute = publicAuthRoutes.some((route) =>
		pathname.startsWith(route),
	);

	if (!isLoggedIn && isProtectedRoute) {
		clearAuthToken();
		return NextResponse.redirect(new URL("/login", request.url));
	}

	if (isLoggedIn && isPublicAuthRoute) {
		return NextResponse.redirect(new URL("/account", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 * - PWA files (service worker, manifest, icons)
		 */
		"/((?!_next/static|_next/image|favicon.ico|public/|sw.js|manifest.json|apple-icon|web-app-manifest).*)",
	],
};
