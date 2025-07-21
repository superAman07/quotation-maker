import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = parseInt((await params).id, 10)
    const route = await prisma.flightRoute.findUnique({ where: { id } })

    if (!route) {
        return NextResponse.json({ error: 'FlightRoute not found' }, { status: 404 })
    }
    console.log("Fetched flight route:", route);
    return NextResponse.json(route)
}

export async function PUT(request: Request, { params }: {params: Promise<{id:string}>}) {
    const id = parseInt((await params).id, 10)
    const { origin, destination, baseFare, airline, imageUrl } = await request.json()

    const updated = await prisma.flightRoute.update({
        where: { id },
        data: { origin, destination, baseFare, airline, imageUrl },
    })

    console.log("Updated flight route:", updated);
    return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: {params: Promise<{id:string}>}) {
    const id = parseInt((await params).id, 10)
    await prisma.flightRoute.delete({ where: { id } })
    return NextResponse.json({ success: true })
}