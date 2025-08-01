import { NextResponse } from 'next/server'; 
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { prisma } from '@/lib/prisma';

type DecodedToken = { name?: string; email?: string; role?: string };
export async function POST(request: Request) {
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
    try {
        const body = await request.json();
        const { name, transfer, ticketPriceAdult, ticketPriceChild, countryId } = body;

        if (!name || ticketPriceAdult === undefined || !countryId) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        const activity = await prisma.activity.create({
            data: {
                name,
                transfer,
                ticketPriceAdult,
                ticketPriceChild,
                countryId,
            },
        });

        return NextResponse.json(activity, { status: 201 });
    } catch (error) {
        console.error('[ACTIVITIES_POST]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const countryId = searchParams.get('countryId');

        const activities = await prisma.activity.findMany({
            where: {
                ...(countryId ? { countryId: parseInt(countryId) } : {}),
            },
            include: {
                country: true,
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        return NextResponse.json(activities);
    } catch (error) {
        console.error('[ACTIVITIES_GET]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}