import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function GET() {
  // Secure the endpoint: Ensure a valid user is logged in.
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
  } catch (e) {
    return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
  }

  // Fetch all destinations
  try {
    const destinations = await prisma.destination.findMany({
      orderBy: { name: 'asc' },
    });
    // Return in the format the frontend expects
    return NextResponse.json({ destinations });
  } catch (error) {
    console.error("Failed to fetch destinations for user:", error);
    return NextResponse.json({ error: "Failed to retrieve destinations" }, { status: 500 });
  }
}