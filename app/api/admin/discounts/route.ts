import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

type DecodedToken = { name?: string; email?: string; role?: string };

export async function GET() {
    const discounts = await prisma.discount.findMany({
        orderBy: { validFrom: 'asc' },
    })
    return NextResponse.json(discounts)
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
    const { code, description, percentage, validFrom, validTo } = await request.json()

    // Basic validation
    if (!code) {
        return NextResponse.json({ error: 'Discount code is required' }, { status: 400 })
    }
    if (percentage == null || isNaN(percentage) || percentage < 0 || percentage > 100) {
        return NextResponse.json(
            { error: 'percentage must be a number between 0 and 100' },
            { status: 400 }
        )
    }
    if (!validFrom || isNaN(Date.parse(validFrom))) {
        return NextResponse.json(
            { error: 'validFrom must be a valid date string' },
            { status: 400 }
        )
    }
    if (!validTo || isNaN(Date.parse(validTo))) {
        return NextResponse.json(
            { error: 'validTo must be a valid date string' },
            { status: 400 }
        )
    }

    const discount = await prisma.discount.create({
        data: {
            code,
            description,
            percentage,
            validFrom: new Date(validFrom),
            validTo: new Date(validTo),
        },
    })

    return NextResponse.json(discount, { status: 201 })
}
