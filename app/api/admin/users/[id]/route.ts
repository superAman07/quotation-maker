// /app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { Role, UserStatus } from '@prisma/client'
 

export async function GET(_req: NextRequest, { params }: {params: Promise<{id:string}>}) {
  const id = parseInt((await params).id, 10)
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      // include isLocked if you added it:
      // isLocked: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  return NextResponse.json(user)
}

export async function PUT(request: NextRequest, { params }: {params: Promise<{id:string}>}) {
  const id = parseInt((await params).id, 10)
  const body = await request.json()

  const { email, name: newName, role: newRole, status: newStatus } = body

  const data: { email?: string; name?: string; role?: Role; status?: UserStatus } = {}

  if (email) {
    data.email = email
  }
  if (newName !== undefined) {
    data.name = newName
  }
  if (newRole !== undefined) {
    if (newRole !== "Employee" && newRole !== "Admin") {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }
    data.role = newRole
  }
  if (newStatus !== undefined) {
    // Validate status value
    const validStatuses = ["ACTIVE", "LOCKED", "SUSPENDED", "INACTIVE"]
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    data.status = newStatus as UserStatus
  }

  const updated = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: {params: Promise<{id:string}>}) {
  const id = parseInt((await params).id, 10)
  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
