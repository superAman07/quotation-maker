import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'

type DecodedToken = { role?: string }

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const countryId = searchParams.get('countryId');
  const where = countryId ? { countryId: Number(countryId) } : {};
  try {
    const currencies = await prisma.countryCurrency.findMany({
      where,
      include: { country: true },
    });
    return NextResponse.json(currencies);
  } catch (error: any) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let decoded: DecodedToken
  try {
    decoded = jwtDecode<DecodedToken>(token)
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
  if (decoded.role !== 'Admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { countryId, currencyCode, conversionRate, baseCurrency, targetCurrency } = await request.json()
  if (countryId == null || !currencyCode || conversionRate == null || !baseCurrency || !targetCurrency ) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  try { 
    const currency = await prisma.countryCurrency.upsert({
      where: {
        countryId_currencyCode: { countryId, currencyCode },
      },
      update: { conversionRate, baseCurrency, targetCurrency },
      create: { countryId, currencyCode, conversionRate, baseCurrency, targetCurrency },
    })

    return NextResponse.json(currency)
  } catch (error: any) {
    console.error('POST /country-currencies upsert error:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}