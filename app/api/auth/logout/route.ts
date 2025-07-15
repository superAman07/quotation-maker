import { NextResponse } from 'next/server';
import { removeTokenCookie } from '@/lib/cookies';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' }, { status: 200 });
  removeTokenCookie(response);
  return response;
}
