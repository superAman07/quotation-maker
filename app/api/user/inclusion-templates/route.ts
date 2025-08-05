import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const templates = await prisma.inclusionTemplate.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(templates);
  } catch (error) {
    console.error("Failed to fetch inclusion templates:", error);
    return NextResponse.json({ error: "Failed to retrieve inclusion templates" }, { status: 500 });
  }
}