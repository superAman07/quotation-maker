import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest, { params }: {params: {id:string}}) {
    const id = parseInt(params.id, 10)
    const destination = await prisma.destination.findUnique({
        where: { id },
    })
    if (!destination) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json(destination, { status: 200 })
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
    console.log('PUT request received')
    const id = parseInt(context.params.id, 10)
    console.log(`Updating destination with ID: ${id}`)
    const { name, state, country, description, imageUrl } = await request.json()

    console.log(`Received data:`, { name, state, country, description, imageUrl })
    const updated = await prisma.destination.update({
        where: { id },
        data: { name, state, country, description, imageUrl },
    })
    console.log(`Updated destination:`, updated)
    return NextResponse.json(updated, { status: 200 })
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id: idString } = await context.params;
    const id = parseInt(idString, 10);
    await prisma.destination.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
