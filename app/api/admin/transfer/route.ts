import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    name?: string; email?: string; role?: string
}

export async function GET() {
    const vehicles = await prisma.vehicleType.findMany({
        orderBy: { type: 'asc' },
    })
    console.log('Fetched vehicles:', vehicles)
    return NextResponse.json(vehicles)
}

export async function POST(request: NextRequest) {

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
    const { type, category, ratePerDay, ratePerKm } = await request.json()
    if (!type) {
        return NextResponse.json({ error: 'Vehicle type is required' }, { status: 400 })
    }
    if (!category || !['INTERCITY', 'LOCAL'].includes(category)) {
        return NextResponse.json(
            { error: 'Category is required and must be INTERCITY or LOCAL' },
            { status: 400 }
        )
    }

    const vehicle = await prisma.vehicleType.create({
        data: {
            type,
            category,
            ratePerDay: ratePerDay ?? undefined,
            ratePerKm: ratePerKm ?? undefined,
        },
    })

    return NextResponse.json(vehicle, { status: 201 })
}
