import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: {params: Promise<{id:string}>}) {
    const id = parseInt((await params).id, 10)
    const tmpl = await prisma.exclusionTemplate.findUnique({
        where: { id },
        include: { exclusions: true },
    })
    if (!tmpl) {
        return NextResponse.json({ error: 'ExclusionTemplate not found' }, { status: 404 })
    }
    return NextResponse.json(tmpl)
}

export async function PUT(request: NextRequest, { params }: {params: Promise<{id:string}>}) {
    const id = parseInt((await params).id, 10)
    const { name, description } = await request.json()

    const data: any = {}
    if (name) data.name = name
    if (description !== undefined) data.description = description

    const updated = await prisma.exclusionTemplate.update({
        where: { id },
        data,
    })
    return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: {params: Promise<{id:string}>}) {
    const id = parseInt((await params).id, 10)
    await prisma.exclusionTemplate.delete({ where: { id } })
    return NextResponse.json({ success: true })
}
