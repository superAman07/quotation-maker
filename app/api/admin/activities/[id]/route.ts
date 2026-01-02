import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        if (!resolvedParams.id) {
            return new NextResponse("Activity ID is required", { status: 400 });
        }

        const activity = await prisma.activity.findUnique({
            where: {
                id: parseInt(resolvedParams.id),
            },
        });

        return NextResponse.json(activity);
    } catch (error) {
        console.error('[ACTIVITY_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await req.json();
        const { name, transfer, ticketPriceAdult, ticketPriceChild, countryId } = body;

        if (!(await params).id) {
            return new NextResponse("Activity ID is required", { status: 400 });
        }

        const activity = await prisma.activity.update({
            where: {
                id: parseInt((await params).id),
            },
            data: {
                name,
                transfer,
                ticketPriceAdult,
                ticketPriceChild,
                countryId,
            },
        });

        return NextResponse.json(activity);
    } catch (error) {
        console.error('[ACTIVITY_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        if (!(await params).id) {
            return new NextResponse("Activity ID is required", { status: 400 });
        }

        await prisma.activity.delete({
            where: {
                id: parseInt((await params).id),
            },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('[ACTIVITY_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}