import { setTokenCookie, signToken } from "@/lib/cookies";
import { verifyPassword } from "@/lib/hash";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

interface LoginCredentials {
    email: string;
    password: string;
}

export async function POST(req: NextRequest) {
    try {
        const { email, password }: LoginCredentials = await req.json();
        if (!email || !password) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        if (user.status !== "ACTIVE") {
            return NextResponse.json({ error: "Account is not active" }, { status: 403 });
        }
        const valid = await verifyPassword(password, user.password);
        if (!valid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }
        const token = signToken({ userId: user.id, role: user.role, name: user.name, email: user.email });
        const response = NextResponse.json({ message: 'Login successful', role: user.role }, { status: 200 });
        setTokenCookie(response, token);
        return response;
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        return NextResponse.json({ message: "An error occurred during login." }, { status: 500 });
    }
}