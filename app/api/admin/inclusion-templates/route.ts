import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

type DecodedToken = { name?: string; email?: string; role?: string };

export async function GET() {
    const templates = await prisma.inclusionTemplate.findMany({
        orderBy: { name: 'asc' },
    })
    return NextResponse.json(templates)
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
    const { name, description } = await request.json()

    if (!name) {
        return NextResponse.json({ error: 'Template name is required' }, { status: 400 })
    }

    const template = await prisma.inclusionTemplate.create({
        data: { name, description },
    })

    return NextResponse.json(template, { status: 201 })
}
