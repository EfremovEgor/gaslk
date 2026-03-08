import { NextResponse } from "next/server";
import { login } from "@lib/auth/actions";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { email, password } = body;
		await login(email, password);
		return NextResponse.json({ ok: true });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		return NextResponse.json(
			{ error: err?.message || "Login failed" },
			{ status: 400 },
		);
	}
}
