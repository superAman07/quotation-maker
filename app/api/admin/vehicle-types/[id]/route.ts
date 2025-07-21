import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
 

export async function GET(_req: Request, { params }: {params: Promise<{ id: string }> }) {
    const id = parseInt((await params).id, 10)
    const vehicle = await prisma.vehicleType.findUnique({ where: { id } })
    if (!vehicle) {
        return NextResponse.json({ error: 'VehicleType not found' }, { status: 404 })
    }
    return NextResponse.json(vehicle)
}

export async function PUT(request: Request, { params }: {params: Promise<{ id: string }> }) {
    const id = parseInt((await params).id, 10)
    const { type, category, ratePerDay, ratePerKm } = await request.json()

    const data: any = {}
    if (type) data.type = type
    if (category) data.category = category
    if (ratePerDay !== undefined) data.ratePerDay = ratePerDay
    if (ratePerKm !== undefined) data.ratePerKm = ratePerKm

    const updated = await prisma.vehicleType.update({
        where: { id },
        data,
    })
    return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }:{ params: Promise<{ id: string }> }) {
    const id = parseInt((await params).id, 10)
    await prisma.vehicleType.delete({ where: { id } })
    return NextResponse.json({ success: true })
}
