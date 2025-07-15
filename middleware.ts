import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parseToken, verifyToken } from '@/lib/cookies';

const PUBLIC_PATHS = ['/user/auth/login',
  '/user/auth/signup',
  '/api/auth/login',
  '/api/auth/register'];

export async function middleware(req: NextRequest) {
  if (PUBLIC_PATHS.some(path => req.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }
  const token = parseToken(req);
  if (!token || !verifyToken(token)) {
    const url = req.nextUrl.clone();
    url.pathname = '/user/auth/login';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ]
};
