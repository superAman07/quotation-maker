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
    const { name, address, coordinates, description, imageUrl, destinationId } = await req.json();
    if (!name) {
        return NextResponse.json({ error: 'Venue name is required' }, { status: 400 })
    }
    if (!destinationId) {
        return NextResponse.json({ error: 'destinationId is required' }, { status: 400 })
    }
    const venue = await prisma.venue.create({
        data: {
            name,
            address,
            coordinates,
            description,
            imageUrl,
            destinationId: parseInt(destinationId, 10),
        }
    })
    if (!venue) {
        return NextResponse.json({ error: 'Failed to create venue' }, { status: 500 })
    }
    return NextResponse.json({ message: 'Venue created successfully', venue }, { status: 201 });
}

export async function GET(req: NextRequest) {
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
    const venues = await prisma.venue.findMany({
        orderBy: { name: 'asc' },
        include: { destination: true }, 
    })
    return NextResponse.json(venues)
}