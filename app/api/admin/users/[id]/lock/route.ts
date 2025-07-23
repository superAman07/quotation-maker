import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = parseInt((await params).id, 10);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Toggle status between ACTIVE and LOCKED
  const newStatus = user.status === "ACTIVE" ? "LOCKED" : "ACTIVE";
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { status: newStatus },
  });

  return NextResponse.json({ isLocked: updated.status === "LOCKED", status: updated.status });
}