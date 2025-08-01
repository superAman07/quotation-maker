import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = parseInt((await params).id, 10)
  const transfer = await prisma.transfer.findUnique({
    where: { id },
    include: { country: true },
  })
  if (!transfer) {
    return NextResponse.json({ error: 'Transfer not found' }, { status: 404 })
  }
  return NextResponse.json(transfer)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = parseInt((await params).id, 10)
  const { type, priceInINR, countryId } = await request.json()

  const data: any = {}
  if (type) data.type = type
  if (priceInINR !== undefined) data.priceInINR = Number(priceInINR)
  if (countryId !== undefined) data.countryId = Number(countryId)

  const updated = await prisma.transfer.update({
    where: { id },
    data,
    include: { country: true },
  })
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = parseInt((await params).id, 10)
  await prisma.transfer.delete({ where: { id } })
  return NextResponse.json({ success: true })
}