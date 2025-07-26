import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = parseInt((await params).id, 10)
    const tax = await prisma.tax.findUnique({ where: { id } })
    if (!tax) {
        return NextResponse.json({ error: 'Tax not found' }, { status: 404 })
    }
    return NextResponse.json(tax)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = parseInt((await params).id, 10)
    const { serviceType, percentage } = await request.json()
    const data: any = {}

    if (serviceType) data.serviceType = serviceType
    if (percentage !== undefined) {
        if (
            typeof percentage !== 'number' ||
            isNaN(percentage) ||
            percentage < 0 ||
            percentage > 100
        ) {
            return NextResponse.json(
                { error: 'percentage must be a number between 0 and 100' },
                { status: 400 }
            )
        }
        data.percentage = percentage
    }

    const updated = await prisma.tax.update({
        where: { id },
        data,
    })
    return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = parseInt((await params).id, 10)
    await prisma.tax.delete({ where: { id } })
    return NextResponse.json({ success: true })
}
