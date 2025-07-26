import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, { params }: {params: Promise<{id: string}>}) {
    const id = parseInt((await params).id, 10)
    const plan = await prisma.mealPlan.findUnique({ where: { id } })
    if (!plan) {
        return NextResponse.json({ error: 'MealPlan not found' }, { status: 404 })
    }
    return NextResponse.json(plan)
}

export async function PUT(request: Request, { params }: {params: Promise<{id: string}>}) {
    const id = parseInt((await params).id, 10)
    const { code, description, ratePerPerson } = await request.json()

    const data: any = {}
    if (code) data.code = code
    if (description !== undefined) data.description = description
    if (ratePerPerson !== undefined) {
        if (isNaN(ratePerPerson)) {
            return NextResponse.json({ error: 'ratePerPerson must be a valid number' }, { status: 400 })
        }
        data.ratePerPerson = ratePerPerson
    }

    const updated = await prisma.mealPlan.update({
        where: { id },
        data,
    })
    return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: {params: Promise<{id:string}>}) {
    const id = parseInt((await params).id, 10)
    await prisma.mealPlan.delete({ where: { id } })
    return NextResponse.json({ success: true })
}
