import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode';

type DecodedToken = { name?: string; email?: string; role?: string };

export async function GET() {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(users)
}

export async function POST(request: NextRequest) {
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

    const { email, name, password, role, assignedCountryIds } = await request.json()

    if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }
    if (role && !['Employee', 'Admin'].includes(role)) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            email,
            name,
            password: hash,
            role: role ?? 'Employee',
            assignedCountries: {
                create: assignedCountryIds?.map((countryId: number) => ({
                    country: {
                        connect: { id: countryId },
                    },
                })),
            },
        },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        }
    })
    return NextResponse.json(user, { status: 201 })
}
