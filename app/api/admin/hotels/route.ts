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
    const { name, starRating, amenities, imageUrl, venueId } = await req.json();
    if (!name) {
        return NextResponse.json({ error: 'Hotel name is required' }, { status: 400 })
    }
    if (!venueId) {
        return NextResponse.json({ error: 'venueId is required' }, { status: 400 })
    }
    const hotel = await prisma.hotel.create({
        data: {
            name,
            starRating: parseInt(starRating, 10),
            amenities,
            imageUrl,
            venue: { connect: { id: parseInt(venueId, 10) } }
        }
    })
    console.log("Hotel created:", hotel);
    if (!hotel) {
        return NextResponse.json({ error: "Failed to create hotel" }, { status: 500 });
    }
    return NextResponse.json({ hotel }, { status: 201 });
}

export async function GET(req: NextRequest) {
    const hotels = await prisma.hotel.findMany({
        orderBy: {
            name: 'asc'
        }, include: {
            venue: true
        }
    })
    console.log("Hotels fetched:", hotels);
    return NextResponse.json({ hotels }, { status: 200 });
}