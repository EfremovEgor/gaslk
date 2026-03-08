import { NextResponse } from "next/server";
import { getCurrentUser } from "@lib/auth/auth";

export async function GET() {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    // remove password field before returning
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    const { password: _pwd, ...rest } = user as any;
    return NextResponse.json(rest);
}
