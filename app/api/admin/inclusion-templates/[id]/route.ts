import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const id = parseInt((await params).id, 10)
    const tmpl = await prisma.inclusionTemplate.findUnique({
        where: { id },
        include: { inclusions: true },
    })
    if (!tmpl) {
        return NextResponse.json({ error: 'InclusionTemplate not found' }, { status: 404 })
    }
    return NextResponse.json(tmpl)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const id = parseInt((await params).id, 10)
    const { name, description } = await request.json()

    const data: any = {}
    if (name) data.name = name
    if (description !== undefined) data.description = description

    const updated = await prisma.inclusionTemplate.update({
        where: { id },
        data,
    })
    return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: {params: Promise<{id:string}>}) {
    const id = parseInt((await params).id, 10)
    await prisma.inclusionTemplate.delete({ where: { id } })
    return NextResponse.json({ success: true })
}
