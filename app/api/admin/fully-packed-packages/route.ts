import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: number;
  email: string;
  role: string;
}

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

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let decoded: DecodedToken;
  try {
    decoded = jwtDecode<DecodedToken>(token);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  if (decoded.role !== "Admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const {
    name,
    description,
    destinationId,
    mealPlan,
    vehicleUsed,
    localVehicleUsed,
    flightCostPerPerson,
    landCostPerPerson,
    totalNights,
    accommodations,
    itinerary,
    inclusions,
    exclusions
  } = await request.json();

  if (!name) {
    return NextResponse.json({ error: 'Package name is required' }, { status: 400 });
  }
  if (!destinationId) {
    return NextResponse.json({ error: 'Destination is required' }, { status: 400 });
  }

  const fullyPackedPackage = await prisma.fullyPackedPackage.create({
    data: {
      name,
      description,
      destinationId,
      mealPlan,
      vehicleUsed,
      localVehicleUsed,
      flightCostPerPerson,
      landCostPerPerson,
      totalNights,
      accommodations: accommodations?.length ? {
        create: accommodations.map((acc: any) => ({
          location: acc.location,
          hotelName: acc.hotelName,
          nights: acc.nights,
        }))
      } : undefined,
      itinerary: itinerary?.length ? {
        create: itinerary.map((item: any) => ({
          dayTitle: item.dayTitle,
          description: item.description,
        }))
      } : undefined,
      inclusions: inclusions?.length ? {
        create: inclusions.map((item: any) => ({
          item: item.item,
        }))
      } : undefined,
      exclusions: exclusions?.length ? {
        create: exclusions.map((item: any) => ({
          item: item.item,
        }))
      } : undefined,
    },
    include: {
      destination: true,
      accommodations: true,
      itinerary: true,
      inclusions: true,
      exclusions: true,
    }
  });

  return NextResponse.json(fullyPackedPackage, { status: 201 });
} 