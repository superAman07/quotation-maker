import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { jwtDecode, JwtPayload } from 'jwt-decode';

// Define an interface that matches your actual JWT payload
interface DecodedToken extends JwtPayload {
  userId: number;
  role: string;
}

export async function GET() { 
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let decoded: DecodedToken;
  try {
    decoded = jwtDecode<DecodedToken>(token);
  } catch (error) { 
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
 
  if (!decoded?.userId) {
    return NextResponse.json({ error: 'Unauthorized: Invalid token payload' }, { status: 401 });
  }

  try {
    const userWithCountries = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        assignedCountries: {
          select: {
            country: {
              select: { id: true, name: true },
            },
          },
          orderBy: {
            country: { name: 'asc' },
          },
        },
      },
    });

    if (!userWithCountries) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (userWithCountries.assignedCountries.length > 0) {
      const assignedCountries = userWithCountries.assignedCountries.map(
        (assignment) => assignment.country
      );
      return NextResponse.json(assignedCountries);
    }

    const allCountries = await prisma.country.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(allCountries);

  } catch (error) {
    console.error("Failed to fetch countries:", error);
    return NextResponse.json({ error: "Failed to retrieve countries" }, { status: 500 });
  }
}