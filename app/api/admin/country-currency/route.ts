import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'

type DecodedToken = { role?: string }

export async function GET() {
  const currencies = await prisma.countryCurrency.findMany()
  return NextResponse.json(currencies)
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

  const { country, currencyCode, conversionRate, baseCurrency, targetCurrency } = await request.json()
  if (!country || !currencyCode || !conversionRate || !baseCurrency || !targetCurrency) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const currency = await prisma.countryCurrency.upsert({
    where: { country },
    update: { currencyCode, conversionRate, baseCurrency, targetCurrency },
    create: { country, currencyCode, conversionRate, baseCurrency, targetCurrency }
  })

  return NextResponse.json(currency)
}