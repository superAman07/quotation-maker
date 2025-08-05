import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const countries = await prisma.country.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(countries);
  } catch (error) {
    console.error("Failed to fetch countries:", error);
    return NextResponse.json({ error: "Failed to retrieve countries" }, { status: 500 });
  }
}