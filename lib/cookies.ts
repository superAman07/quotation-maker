import { serialize, parse } from 'cookie';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { jwtVerify } from 'jose';

const TOKEN_NAME = 'auth_token';
const MAX_AGE = 60 * 60 ; // 1 hour
const JWT_SECRET = process.env.JWT_SECRET!;

export function setTokenCookie(res: NextResponse, token: string) {
  const cookie = serialize(TOKEN_NAME, token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });
  res.headers.set('Set-Cookie', cookie);
}

export function removeTokenCookie(res: NextResponse) {
  const cookie = serialize(TOKEN_NAME, '', {
    maxAge: -1,
    path: '/',
  });
  res.headers.set('Set-Cookie', cookie);
}

export function parseToken(req: NextRequest): string | null {
  const cookie = req.headers.get('cookie');
  if (!cookie) return null;
  const parsed = parse(cookie);
  return parsed[TOKEN_NAME] || null;
}

export function signToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: MAX_AGE });
}

export async function verifyToken(token: string): Promise<any> {
  if (!JWT_SECRET) return null;
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}