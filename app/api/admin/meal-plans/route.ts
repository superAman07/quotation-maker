import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    name?: string; email?: string; role?: string
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const countryId = searchParams.get('countryId');

    if (!countryId) {
        return NextResponse.json({ error: "Country ID is required" }, { status: 400 });
    }

    const plans = await prisma.mealPlan.findMany({
        where: {
            countryId: parseInt(countryId),
        },
        orderBy: { name: 'asc' },
    })
    return NextResponse.json(plans)
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
    const { name, description, ratePerPerson, countryId } = await request.json()

    if (!name) {
        return NextResponse.json({ error: 'Meal plan name is required' }, { status: 400 })
    }
    if (ratePerPerson == null || isNaN(ratePerPerson)) {
        return NextResponse.json({ error: 'ratePerPerson must be a valid number' }, { status: 400 })
    }
    if (!countryId) {
        return NextResponse.json({ error: 'countryId is required' }, { status: 400 })
    }
    const mealPlan = await prisma.mealPlan.create({
        data: { name, description, ratePerPerson: parseFloat(ratePerPerson), countryId: parseInt(countryId) },
    })
    return NextResponse.json(mealPlan, { status: 201 })
}
