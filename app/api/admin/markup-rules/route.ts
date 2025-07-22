import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

type DecodedToken = { name?: string; email?: string; role?: string };

export async function GET() {
    const rules = await prisma.markupRule.findMany({
        orderBy: { serviceType: 'asc' },
    })
    return NextResponse.json(rules)
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
    const { serviceType, percentage } = await request.json()

    if (!serviceType) {
        return NextResponse.json({ error: 'serviceType is required' }, { status: 400 })
    }
    if (percentage == null || isNaN(percentage) || percentage < 0) {
        return NextResponse.json(
            { error: 'percentage must be a non-negative number' },
            { status: 400 }
        )
    }

    const rule = await prisma.markupRule.create({
        data: { serviceType, percentage },
    })
    if (!rule) {
        return NextResponse.json({ error: 'Failed to create markup rule' }, { status: 500 })
    }
    return NextResponse.json(rule, { status: 201 })
}
