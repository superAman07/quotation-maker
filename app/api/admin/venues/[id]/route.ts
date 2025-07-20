// /app/api/admin/venues/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma";
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

type DecodedToken = { name?: string; email?: string; role?: string };
interface Params { params: { id: string } }

export async function GET(_req: Request, { params }: Params) {
    const id = parseInt(params.id, 10)
    const venue = await prisma.venue.findUnique({
        where: { id },
        include: { destination: true },
    })
    if (!venue) {
        return NextResponse.json({ error: 'Venue not found' }, { status: 404 })
    }
    return NextResponse.json(venue)
}

export async function PUT(request: Request, context: { params: { id: string } }) {
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

    console.log("Updating venue with ID:", context.params.id);
    const id = parseInt(context.params.id, 10)

    const { name, address, coordinates, description, imageUrl, destinationId } = await request.json();
    console.log("Request data:", { name, address, coordinates, description, imageUrl, destinationId });
    if (!name) {
        return NextResponse.json({ error: 'Venue name is required' }, { status: 400 })
    }
    const data: any = { name, address, coordinates, description, imageUrl }
    if (destinationId) {
        data.destination = { connect: { id: destinationId } }
    }
    if (!destinationId) {
        return NextResponse.json({ error: 'destinationId is required' }, { status: 400 })
    }
    const updated = await prisma.venue.update({
        where: { id },
        data: {
            ...data,
            destination: {
                connect: {
                    id: parseInt(destinationId, 10)  
                }
            }
        }
    })
    if (!updated) {
        return NextResponse.json({ error: 'Failed to update venue' }, { status: 500 })
    }
    return NextResponse.json(updated)
}

export async function DELETE(_req: Request, context: {params: Promise<{id:string}>}) {
    const id = parseInt((await context.params).id, 10)
    await prisma.venue.delete({ where: { id } })
    return NextResponse.json({ success: true })
}
