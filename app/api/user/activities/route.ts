import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try { 
    const activities = await prisma.activity.findMany({
      include: { country: true },
      orderBy: { name: 'asc' }
    });
    
    return NextResponse.json(activities);
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    return NextResponse.json({ error: "Failed to retrieve activities" }, { status: 500 });
  }
}