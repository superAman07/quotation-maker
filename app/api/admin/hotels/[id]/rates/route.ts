import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
 
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const hotelId = parseInt((await params).id, 10);
  if (isNaN(hotelId)) {
    return NextResponse.json({ error: "Invalid hotelId" }, { status: 400 });
  }
  const rates = await prisma.hotelRateCard.findMany({
    where: { hotelId },
    orderBy: { roomType: "asc" },
  });
  return NextResponse.json({ rates });
}
 
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const hotelId = parseInt(params.id, 10);
  if (isNaN(hotelId)) {
    return NextResponse.json({ error: "Invalid hotelId" }, { status: 400 });
  }
  const { roomType, season, rate } = await req.json();
  if (!roomType || !season || !rate) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const rateCard = await prisma.hotelRateCard.create({
    data: {
      hotelId,
      roomType,
      season,
      rate: parseFloat(rate),
    },
  });
  return NextResponse.json({ rate: rateCard , message: "Rate card created successfully" }, { status: 201 });
}