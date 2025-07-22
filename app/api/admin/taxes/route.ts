import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode';

type DecodedToken = { name?: string; email?: string; role?: string };

export async function GET() {
    const taxes = await prisma.tax.findMany({
        orderBy: { serviceType: 'asc' },
    })
    return NextResponse.json(taxes)
}

export async function POST(request: Request) {
    const cookieStore = await cookies()
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
    if (
        percentage == null ||
        typeof percentage !== 'number' ||
        percentage < 0 ||
        percentage > 100
    ) {
        return NextResponse.json(
            { error: 'percentage must be a number between 0 and 100' },
            { status: 400 }
        )
    }

    const tax = await prisma.tax.create({
        data: { serviceType, percentage },
    })
    return NextResponse.json(tax, { status: 201 })
}
