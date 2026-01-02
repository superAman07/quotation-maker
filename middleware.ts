import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parseToken, verifyToken } from '@/lib/cookies';

const PUBLIC_PATHS = ['/user/auth/login',
  '/user/auth/signup',
  '/api/auth/login',
  '/api/auth/register',
  '/admin/auth/login',     
  '/admin/auth/signup'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === '/') {
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = parseToken(req);
  
  if (!token || !verifyToken(token)) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ]
};
