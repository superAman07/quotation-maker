import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const mealPlans = await prisma.mealPlan.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(mealPlans);
  } catch (error) {
    console.error("Failed to fetch meal plans:", error);
    return NextResponse.json({ error: "Failed to retrieve meal plans" }, { status: 500 });
  }
}