import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

interface Params { params: { id: string } }

export async function GET(_req: Request, { params }: Params) {
  const id = parseInt(params.id, 10)
  const hotel = await prisma.hotel.findUnique({
    where: { id },
    include: { venue: true },
  })
  if (!hotel) {
    return NextResponse.json({ error: 'Hotel not found' }, { status: 404 })
  }
  return NextResponse.json(hotel)
}

export async function PUT(request: Request, { params }: Params) {
  const id = parseInt(params.id, 10)
  let { name, starRating, amenities, imageUrl, venueId } = await request.json()

  starRating = parseInt(starRating, 10)
  if (venueId) venueId = parseInt(venueId, 10)

  const data: any = { name, starRating: parseInt(starRating, 10), amenities, imageUrl }
  if (venueId) {
    data.venue = { connect: { id: venueId } }
  }

  const updated = await prisma.hotel.update({
    where: { id },
    data,
    include: { venue: true },
  })
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, context: {params : Promise<{id: string}>}) {
  const id = parseInt((await context.params).id, 10)
  await prisma.hotel.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
