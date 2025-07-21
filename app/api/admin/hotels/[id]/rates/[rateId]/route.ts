import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; rateId: string }> }
) {
  const hotelId = parseInt((await params).id, 10);
  const rateId = parseInt((await params).rateId, 10);
  const { roomType, season, rate } = await req.json();

  if (isNaN(hotelId) || isNaN(rateId)) {
    return NextResponse.json({ error: "Invalid IDs" }, { status: 400 });
  }

  const updated = await prisma.hotelRateCard.update({
    where: { id: rateId, hotelId },
    data: {
      roomType,
      season,
      rate: parseFloat(rate),
    },
  });
  return NextResponse.json({ rate: updated, message: "Rate card updated successfully" }, { status: 200 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; rateId: string }> }
) {
  const hotelId = parseInt((await params).id, 10);
  const rateId = parseInt((await params).rateId, 10);

  if (isNaN(hotelId) || isNaN(rateId)) {
    return NextResponse.json({ error: "Invalid IDs" }, { status: 400 });
  }

  await prisma.hotelRateCard.delete({
    where: { id: rateId, hotelId },
  });
  return NextResponse.json({ success: true });
}