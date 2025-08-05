import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { name, code, city } = await request.json();

    if (!name || !code || !city) {
        return NextResponse.json({ error: 'Name, code, and city are required' }, { status: 400 });
    }

    try {
        const updatedAirport = await prisma.airport.update({
            where: { id: parseInt(id) },
            data: { name, code, city },
        });
        return NextResponse.json(updatedAirport);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update airport' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        await prisma.airport.delete({
            where: { id: parseInt(id) },
        });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete airport' }, { status: 500 });
    }
}