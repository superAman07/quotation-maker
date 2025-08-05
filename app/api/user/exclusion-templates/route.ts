import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const templates = await prisma.exclusionTemplate.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(templates);
  } catch (error) {
    console.error("Failed to fetch exclusion templates:", error);
    return NextResponse.json({ error: "Failed to retrieve exclusion templates" }, { status: 500 });
  }
}