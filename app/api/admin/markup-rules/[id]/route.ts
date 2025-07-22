import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' 

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }>}) {
    const id = parseInt((await params).id, 10)
    const rule = await prisma.markupRule.findUnique({ where: { id } })
    if (!rule) {
        return NextResponse.json({ error: 'MarkupRule not found' }, { status: 404 })
    }
    return NextResponse.json(rule)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }>}) {
    const id = parseInt((await params).id, 10)
    const { serviceType, percentage } = await request.json()
    const data: any = {}

    if (serviceType) data.serviceType = serviceType
    if (percentage !== undefined) {
        if (isNaN(percentage) || percentage < 0) {
            return NextResponse.json(
                { error: 'percentage must be a non‑negative number' },
                { status: 400 }
            )
        }
        data.percentage = percentage
    }

    const updated = await prisma.markupRule.update({
        where: { id },
        data,
    })
    return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }>}) {
    const id = parseInt((await params).id, 10)
    await prisma.markupRule.delete({ where: { id } })
    return NextResponse.json({ success: true })
}
