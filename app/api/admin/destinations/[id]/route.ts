import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server' 

interface Params { params: { id: string } }

export async function GET(_req: Request, { params }: Params) {
  const id = parseInt(params.id, 10)
  const destination = await prisma.destination.findUnique({
    where: { id },
  })
  if (!destination) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(destination)
}

export async function PUT(request: Request, { params }: Params) {
  const id = parseInt(params.id, 10)
  const { name, state, country, description, imageUrl } = await request.json()
 
  const updated = await prisma.destination.update({
    where: { id },
    data: { name, state, country, description, imageUrl },
  })
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: Params) {
  const id = parseInt(params.id, 10)
  await prisma.destination.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
