import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const cookie = req.headers.get("cookie") || "";
        const tokenMatch = cookie.match(/auth_token=([^;]+)/);
        const token = tokenMatch ? tokenMatch[1] : null;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const secret = process.env.JWT_SECRET!;
        let payload;
        try {
            payload = jwt.verify(token, secret);
        } catch {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let userId: number | undefined;
        if (typeof payload === "object" && payload !== null && "userId" in payload) {
            userId = Number((payload as jwt.JwtPayload).userId);
        }

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const quotation = await prisma.quotation.findUnique({
            where: { id: (await params).id },
            include: {
                createdBy: true,
                itinerary: true,
                accommodations: true,
                inclusions: true,
                exclusions: true, 
            }
        });

        if (!quotation || quotation.createdById !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json(quotation);
    } catch (error) {
        console.error("Error fetching quotation:", error);
        return NextResponse.json({ error: "Failed to fetch quotation" }, { status: 500 });
    }
}