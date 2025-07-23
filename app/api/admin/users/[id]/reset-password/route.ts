import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = parseInt((await params).id, 10);
  const { password } = await req.json();

  if (!password || password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const hash = await bcrypt.hash(password, 10);

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { password: hash },
  });

  return NextResponse.json({ success: true });
}