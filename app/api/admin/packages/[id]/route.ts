import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface Params { params: { id: string } }

export async function GET(_req: Request, { params }: Params) {
    const id = parseInt(params.id, 10)
    const pkg = await prisma.package.findUnique({
        where: { id },
        include: { packageItineraries: { orderBy: { dayNumber: 'asc' } } }
    })
    if (!pkg) {
        return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    }
    return NextResponse.json(pkg)
}

export async function PUT(request: Request, { params }: Params) {
    const id = parseInt(params.id, 10)
    const {
        name,
        description,
        durationDays,
        totalNights,
        basePricePerPerson,
        packageItineraries
    } = await request.json()
 
    const data: any = {}
    if (name) data.name = name
    if (description !== undefined) data.description = description
    if (durationDays !== undefined) {
        if (isNaN(durationDays)) {
            return NextResponse.json({ error: 'durationDays must be a number' }, { status: 400 })
        }
        data.durationDays = durationDays
    }
    if (totalNights !== undefined) {
        if (isNaN(totalNights)) {
            return NextResponse.json({ error: 'totalNights must be a number' }, { status: 400 })
        }
        data.totalNights = totalNights
    }
    if (basePricePerPerson !== undefined) {
        if (isNaN(basePricePerPerson)) {
            return NextResponse.json({ error: 'basePricePerPerson must be a number' }, { status: 400 })
        }
        data.basePricePerPerson = basePricePerPerson
    }
 
    if (Array.isArray(packageItineraries)) {
        data.packageItineraries = {
            deleteMany: {},    
            create: packageItineraries.map((i: any) => ({
                dayNumber: i.dayNumber,
                title: i.title,
                description: i.description
            }))
        }
    }

    const updated = await prisma.package.update({
        where: { id },
        data,
        include: { packageItineraries: { orderBy: { dayNumber: 'asc' } } }
    })
    return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: Params) {
    const id = parseInt(params.id, 10)
    // This will cascade‐delete itineraries if you have `onDelete: Cascade` set in your schema,
    // otherwise you may need to delete them first.
    await prisma.package.delete({ where: { id } })
    return NextResponse.json({ success: true })
}
