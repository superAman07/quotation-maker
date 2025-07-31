import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(_req: Request, { params }: {params: Promise<{id:string}>}) {
  const id = parseInt((await params).id, 10)
  const hotel = await prisma.hotel.findUnique({
    where: { id },
    include: { destination: true, country: true },
  })
  if (!hotel) {
    return NextResponse.json({ error: 'Hotel not found' }, { status: 404 })
  }
  return NextResponse.json(hotel)
}

export async function PUT(request: Request, { params }: {params: Promise<{id:string}>}) {
  const id = parseInt((await params).id, 10)
  let { name, starRating, amenities, destinationId, countryId, mealPlan, source, basePricePerNight } = await request.json()

  const data: any = {
    name,
    starRating: starRating ? parseInt(starRating, 10) : null,
    amenities, 
    destinationId: destinationId ? parseInt(destinationId, 10) : undefined,
    countryId: countryId ? parseInt(countryId, 10) : undefined,
    mealPlan,
    source,
    basePricePerNight: basePricePerNight ? parseFloat(basePricePerNight) : null,
  }

  const updated = await prisma.hotel.update({
    where: { id },
    data,
    include: { destination: true, country: true },
  })
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, context: {params : Promise<{id: string}>}) {
  const id = parseInt((await context.params).id, 10)
  await prisma.hotel.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
