import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

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
            where: {
                id: (await params).id,
                createdById: Number(userId),
            },
            include: {
                createdBy: { select: { name: true } },
                accommodations: true,
                transfers: true,
                itinerary: true,
                inclusions: true,
                exclusions: true,
                activities: true,
                mealPlan: true,
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

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as Promise<{userId: string; role: string}>;
        const userId = (await decoded).userId;
        const { id } = await params;
        const { status } = await req.json();

        if (!id || !status) {
            return NextResponse.json({ error: "Quotation ID and status are required" }, { status: 400 });
        }

        const updatedQuotation = await prisma.quotation.update({
            where: {
                id: id,
                createdById: Number(userId),
            },
            data: {
                status: status,
            },
        });

        return NextResponse.json(updatedQuotation);

    } catch (error) {
        console.error("Error updating quotation status:", error);
        return NextResponse.json({ error: "Invalid token or server error" }, { status: 500 });
    }
}