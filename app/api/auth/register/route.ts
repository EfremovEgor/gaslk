import { NextResponse } from "next/server";
import { register } from "@lib/auth/actions";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { email, password } = body;
		await register(email, password);
		return NextResponse.json({ ok: true }, { status: 201 });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		return NextResponse.json(
			{ error: err?.message || "Registration failed" },
			{ status: 400 },
		);
	}
}
