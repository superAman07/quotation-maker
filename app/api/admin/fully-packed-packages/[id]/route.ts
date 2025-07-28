import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: number;
  email: string;
  role: string;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = parseInt((await params).id, 10);
  const fullyPackedPackage = await prisma.fullyPackedPackage.findUnique({
    where: { id },
    include: {
      destination: true,
      accommodations: true,
      itinerary: true,
      inclusions: true,
      exclusions: true,
    }
  });
  if (!fullyPackedPackage) {
    return NextResponse.json({ error: 'Fully packed package not found' }, { status: 404 });
  }
  return NextResponse.json(fullyPackedPackage);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

  const id = parseInt((await params).id, 10);
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

  // Delete existing related data
  await prisma.fullyPackedPackageAccommodation.deleteMany({
    where: { packageId: id }
  });
  await prisma.fullyPackedPackageItinerary.deleteMany({
    where: { packageId: id }
  });
  await prisma.fullyPackedPackageInclusion.deleteMany({
    where: { packageId: id }
  });
  await prisma.fullyPackedPackageExclusion.deleteMany({
    where: { packageId: id }
  });

  const fullyPackedPackage = await prisma.fullyPackedPackage.update({
    where: { id },
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

  return NextResponse.json(fullyPackedPackage);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
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

  const id = parseInt((await params).id, 10);

  // Delete related data first
  await prisma.fullyPackedPackageAccommodation.deleteMany({
    where: { packageId: id }
  });
  await prisma.fullyPackedPackageItinerary.deleteMany({
    where: { packageId: id }
  });
  await prisma.fullyPackedPackageInclusion.deleteMany({
    where: { packageId: id }
  });
  await prisma.fullyPackedPackageExclusion.deleteMany({
    where: { packageId: id }
  });

  // Delete the package
  await prisma.fullyPackedPackage.delete({
    where: { id }
  });

  return NextResponse.json({ message: 'Fully packed package deleted successfully' });
} 