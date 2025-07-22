import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

type DecodedToken = { name?: string; email?: string; role?: string };

export async function GET() {
    const packages = await prisma.package.findMany({
        orderBy: { name: 'asc' },
        include: {
            packageItineraries: { orderBy: { dayNumber: 'asc' } }
        }
    })
    return NextResponse.json(packages)
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
    const {
        name,
        description,
        durationDays,
        totalNights,
        basePricePerPerson,
        packageItineraries
    } = await request.json()

    if (!name) {
        return NextResponse.json({ error: 'Package name is required' }, { status: 400 })
    }
    if (durationDays == null || isNaN(durationDays)) {
        return NextResponse.json({ error: 'durationDays must be a valid number' }, { status: 400 })
    }
    if (totalNights == null || isNaN(totalNights)) {
        return NextResponse.json({ error: 'totalNights must be a valid number' }, { status: 400 })
    }
    if (basePricePerPerson == null || isNaN(basePricePerPerson)) {
        return NextResponse.json({ error: 'basePricePerPerson must be a valid number' }, { status: 400 })
    }

    const pkg = await prisma.package.create({
        data: {
            name,
            description,
            durationDays,
            totalNights,
            basePricePerPerson,
            packageItineraries: packageItineraries?.length
                ? {
                    create: packageItineraries.map((i: any) => ({
                        dayNumber: i.dayNumber,
                        title: i.title,
                        description: i.description
                    }))
                }
                : undefined
        },
        include: {
            packageItineraries: { orderBy: { dayNumber: 'asc' } }
        }
    })

    return NextResponse.json(pkg, { status: 201 })
}
