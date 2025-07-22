import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const packageId = parseInt((await params).id, 10);
  const { dayNumber, title, description } = await req.json();

  if (
    typeof dayNumber !== "number" ||
    !title ||
    !description
  ) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  const itinerary = await prisma.packageItinerary.create({
    data: {
      packageId,
      dayNumber,
      title,
      description,
    },
  });

  return NextResponse.json({ itinerary }, { status: 201 });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const packageId = parseInt((await params).id, 10);
  const items = await prisma.packageItinerary.findMany({
    where: { packageId },
    orderBy: { dayNumber: "asc" },
  });
  return NextResponse.json(items, { status: 200 });
}