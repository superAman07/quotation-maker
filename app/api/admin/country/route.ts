import { prisma } from "@/lib/prisma";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type DecodedToken = { role?: string }
export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    const decoded = jwtDecode<DecodedToken>(token);
    if (decoded.role !== 'Admin') {
        return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }
    const { name, code, flag, currency } = await req.json();
    if (!name || !code || !flag || !currency) {
        return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }
    try {
        const country = await prisma.country.create({
            data: { name, code, flag, currency }
        })
        return NextResponse.json({ success: true, message: 'Country added', data: country }, { status: 201 })
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ success: false, message: 'Country code must be unique' }, { status: 409 })
        }
        return NextResponse.json({ success: false, message: 'Failed to add country' }, { status: 500 })
    }
}

export async function GET() {
    const countries = await prisma.country.findMany({
        orderBy: { name: 'asc' }
    })
    return NextResponse.json({ success: true, data: countries });
}