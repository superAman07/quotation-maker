import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const packages = await prisma.package.findMany({
        orderBy: { name: 'asc' },
        include: {  
            packageItineraries: { orderBy: { dayNumber: 'asc' } }
        }
    })
    return NextResponse.json(packages)
}

export async function POST(request: Request) {
    const {
        name,
        description,
        durationDays,
        totalNights,
        basePricePerPerson, 
        packageItineraries
    } = await request.json()
 
    if (!name) {
        return NextResponse.json({ error: 'Package name is required' }, { status: 400 })
    }
    if (durationDays == null || isNaN(durationDays)) {
        return NextResponse.json({ error: 'durationDays must be a valid number' }, { status: 400 })
    }
    if (totalNights == null || isNaN(totalNights)) {
        return NextResponse.json({ error: 'totalNights must be a valid number' }, { status: 400 })
    }
    if (basePricePerPerson == null || isNaN(basePricePerPerson)) {
        return NextResponse.json({ error: 'basePricePerPerson must be a valid number' }, { status: 400 })
    }

    const pkg = await prisma.package.create({
        data: {
            name,
            description,
            durationDays,
            totalNights,
            basePricePerPerson,
            packageItineraries: packageItineraries?.length
                ? {
                    create: packageItineraries.map((i: any) => ({
                        dayNumber: i.dayNumber,
                        title: i.title,
                        description: i.description
                    }))
                }
                : undefined
        },
        include: {
            packageItineraries: { orderBy: { dayNumber: 'asc' } }
        }
    })

    return NextResponse.json(pkg, { status: 201 })
}
