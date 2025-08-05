import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const airports = await prisma.airport.findMany({
      select: { id: true, name: true, code: true, countryId: true },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(airports);
  } catch (error) {
    console.error("Failed to fetch airports:", error);
    return NextResponse.json({ error: "Failed to retrieve airports" }, { status: 500 });
  }
}