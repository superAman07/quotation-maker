import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    name?: string; email?: string; role?: string
}

export async function GET() {
    const plans = await prisma.mealPlan.findMany({
        orderBy: { code: 'asc' },
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
    const { code, description, ratePerPerson } = await request.json()

    if (!code) {
        return NextResponse.json({ error: 'Meal plan code is required' }, { status: 400 })
    }
    if (ratePerPerson == null || isNaN(ratePerPerson)) {
        return NextResponse.json({ error: 'ratePerPerson must be a valid number' }, { status: 400 })
    }
    const mealPlan = await prisma.mealPlan.create({
        data: { code, description, ratePerPerson: parseFloat(ratePerPerson) },
    })
    return NextResponse.json(mealPlan, { status: 201 })
}
