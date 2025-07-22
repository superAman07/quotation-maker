// /app/api/admin/users/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

export async function GET() { 
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(users)
}

export async function POST(request: Request) {
    const { email, name, password, role } = await request.json()

    // validations
    if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }
    if (role && !['Employee', 'Admin'].includes(role)) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // hash password
    const hash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            email,
            name,
            password: hash,
            role: role ?? 'Employee',
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
