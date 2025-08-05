import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    role?: string;
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const countryId = searchParams.get('countryId');

    if (!countryId) {
        return NextResponse.json({ error: "Country ID is required" }, { status: 400 });
    }

    try {
        const airports = await prisma.airport.findMany({
            where: { countryId: parseInt(countryId) },
            orderBy: { name: 'asc' },
        });
        return NextResponse.json(airports);
    } catch (error) {
        return NextResponse.json({ error: "Failed to retrieve airports" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.role !== "Admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { name, code, city, countryId } = await request.json();

    if (!name || !code || !city || !countryId) {
        return NextResponse.json({ error: 'Name, code, city, and countryId are required' }, { status: 400 });
    }

    try {
        const airport = await prisma.airport.create({
            data: { name, code, city, countryId: parseInt(countryId) },
        });
        return NextResponse.json(airport, { status: 201 });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'An airport with this code already exists.' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to create airport' }, { status: 500 });
    }
}