import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: {params: Promise<{id:string}>}) {
    const id = parseInt((await params).id, 10)
    const discount = await prisma.discount.findUnique({ where: { id } })
    if (!discount) {
        return NextResponse.json({ error: 'Discount not found' }, { status: 404 })
    }
    return NextResponse.json(discount)
}

export async function PUT(request: NextRequest, { params }: {params: Promise<{id:string}>}) {
    const id = parseInt((await params).id, 10)
    const { code, description, percentage, validFrom, validTo } = await request.json()

    const data: any = {}
    if (code) data.code = code
    if (description !== undefined) data.description = description
    if (percentage !== undefined) {
        if (isNaN(percentage) || percentage < 0 || percentage > 100) {
            return NextResponse.json(
                { error: 'percentage must be a number between 0 and 100' },
                { status: 400 }
            )
        }
        data.percentage = percentage
    }
    if (validFrom !== undefined) {
        if (isNaN(Date.parse(validFrom))) {
            return NextResponse.json(
                { error: 'validFrom must be a valid date string' },
                { status: 400 }
            )
        }
        data.validFrom = new Date(validFrom)
    }
    if (validTo !== undefined) {
        if (isNaN(Date.parse(validTo))) {
            return NextResponse.json(
                { error: 'validTo must be a valid date string' },
                { status: 400 }
            )
        }
        data.validTo = new Date(validTo)
    }

    const updated = await prisma.discount.update({
        where: { id },
        data,
    })
    return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: {params: Promise<{id:string}>}) {
    const id = parseInt((await params).id, 10)
    await prisma.discount.delete({ where: { id } })
    return NextResponse.json({ success: true })
}
