import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken"; 

export async function GET(req: Request) {
    try { 
        const cookie = req.headers.get("cookie") || "";
        const tokenMatch = cookie.match(/auth_token=([^;]+)/);
        const token = tokenMatch ? tokenMatch[1] : null;

        if (!token) {
            return NextResponse.json([], { status: 401 });
        }
 
        const secret = process.env.JWT_SECRET!;
        let payload;
        try {
            payload = jwt.verify(token, secret);
        } catch {
            return NextResponse.json([], { status: 401 });
        }
 
        let email: string | undefined;
        if (typeof payload === "object" && payload !== null && "email" in payload) {
            email = (payload as jwt.JwtPayload).email as string | undefined;
        }

        if (!email) {
            return NextResponse.json([], { status: 401 });
        }

        const quotations = await prisma.quotation.findMany({
            where: {
                createdBy: {
                    email: email 
                }
            }
        });

        return NextResponse.json(quotations);
    } catch (error) {
        console.error("Error fetching quotations:", error);
        return NextResponse.json({ error: "Failed to fetch quotations" }, { status: 500 });
    }
}