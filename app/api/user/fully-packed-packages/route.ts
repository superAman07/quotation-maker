import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const fullyPackedPackages = await prisma.fullyPackedPackage.findMany({
    orderBy: { name: 'asc' },
    include: {
      destination: true,
      accommodations: true,
      itinerary: true,
      inclusions: true,
      exclusions: true,
    }
  });
  return NextResponse.json(fullyPackedPackages);
} 