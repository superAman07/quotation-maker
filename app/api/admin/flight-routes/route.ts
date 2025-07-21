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
    const { origin, destination, baseFare, airline, imageUrl } = await req.json();
    if (!origin || !destination || baseFare == null) {
        return NextResponse.json(
            { error: 'origin, destination and baseFare are required' },
            { status: 400 }
        )
    }
    console.log("Creating new flight route with data:", {
        origin,
        destination,
        baseFare,
        airline,
        imageUrl
    });
    const newRoute = await prisma.flightRoute.create({
        data: {
            origin,
            destination,
            baseFare,
            airline,
            imageUrl
        }
    })
    console.log("New flight route created:", newRoute);
    if (!newRoute) {
        return NextResponse.json({ error: "Failed to create flight route" }, { status: 500 });
    }
    return NextResponse.json({ newRoute , message: "New Flight route created successfully" }, { status: 201 });
}

export async function GET(){
    const routes = await prisma.flightRoute.findMany({
        orderBy: {
            origin: 'asc'
        }
    })
    console.log("Fetched flight routes:", routes);
    return NextResponse.json({ routes }, { status: 200 });
}