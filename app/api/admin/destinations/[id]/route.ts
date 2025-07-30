import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest, { params }: {params: Promise<{id:string}>}) {
    const id = parseInt((await params).id, 10)
    const destination = await prisma.destination.findUnique({
        where: { id },
    })
    if (!destination) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json(destination, { status: 200 })
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    const id = parseInt((await context.params).id, 10) 
    const { name, state, description, imageUrl } = await request.json()
 
    const updated = await prisma.destination.update({
        where: { id },
        data: { name, state, description, imageUrl },
    }) 
    return NextResponse.json(updated, { status: 200 })
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id: idString } = await context.params;
    const id = parseInt(idString, 10);
    await prisma.destination.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
