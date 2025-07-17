import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    const payload = jwtDecode(token) as { name?: string; email?: string; role?: string };
    return NextResponse.json({ user: payload },{status: 201});
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}