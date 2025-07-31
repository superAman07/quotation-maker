import { prisma } from "@/lib/prisma";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type DecodedToken = { name?: string; email?: string; role?: string };
export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded: DecodedToken;
    try {
        decoded = jwtDecode<DecodedToken>(token);
    } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    if (decoded.role !== "Admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { name, starRating, amenities, imageUrl, countryId, destinationId } = await req.json();
    if (!name || !countryId || !destinationId) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const hotel = await prisma.hotel.create({
        data: {
            name,
            starRating: parseInt(starRating, 10),
            amenities,
            imageUrl,
            countryId: Number(countryId),
            destinationId: Number(destinationId),
        }
    })
    console.log("Hotel created:", hotel);
    if (!hotel) {
        return NextResponse.json({ error: "Failed to create hotel" }, { status: 500 });
    }
    return NextResponse.json({ hotel }, { status: 201 });
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const countryId = searchParams.get('countryId');
    const where: any = {};
    if (countryId) {
        where.countryId = Number(countryId);
    }

    const hotels = await prisma.hotel.findMany({
        where,
        orderBy: { name: 'asc' },
        include: { country: true, destination: true }
    });
    return NextResponse.json({ hotels }, { status: 200 });
}