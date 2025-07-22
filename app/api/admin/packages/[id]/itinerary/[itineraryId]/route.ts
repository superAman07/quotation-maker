import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; itineraryId: string }> }
) {
    const itineraryId = parseInt((await params).itineraryId, 10);
    const { dayNumber, title, description } = await req.json();

    const itinerary = await prisma.packageItinerary.update({
        where: { id: itineraryId },
        data: { dayNumber, title, description },
    });

    return NextResponse.json({ itinerary }, { status: 200 });
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; itineraryId: string }> }
) {
    const itineraryId = parseInt((await params).itineraryId, 10);
    await prisma.packageItinerary.delete({ where: { id: itineraryId } });
    return NextResponse.json({ success: true });
}