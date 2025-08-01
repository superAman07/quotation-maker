import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    name?: string; email?: string; role?: string
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const countryId = searchParams.get("countryId");

  const where = countryId ? { countryId: Number(countryId) } : {};

  const transfers = await prisma.transfer.findMany({
    where,
    include: { country: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(transfers);
}
// export async function GET() {
//   const transfers = await prisma.transfer.findMany({
//     include: { country: true },
//     orderBy: { createdAt: "desc" },
//   });
//   return NextResponse.json(transfers);
// }
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

    const { type, priceInINR, countryId } = await request.json();
    if (!type || !priceInINR || !countryId) {
        return NextResponse.json({ error: "type, priceInINR, and countryId are required" }, { status: 400 });
    }

    const transfer = await prisma.transfer.create({
        data: {
            type,
            priceInINR: Number(priceInINR),
            countryId: Number(countryId),
        },
    });

    return NextResponse.json(transfer, { status: 201 });
}