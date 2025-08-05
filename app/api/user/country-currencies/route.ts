import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const currencies = await prisma.countryCurrency.findMany();
    return NextResponse.json(currencies);
  } catch (error) {
    console.error("Failed to fetch country currencies:", error);
    return NextResponse.json({ error: "Failed to retrieve country currencies" }, { status: 500 });
  }
}