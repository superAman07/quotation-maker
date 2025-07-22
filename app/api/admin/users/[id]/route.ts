// /app/api/admin/users/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { Role } from '@prisma/client'

interface Params { params: { id: string } }

export async function GET(_req: Request, { params }: Params) {
  const id = parseInt(params.id, 10)
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

export async function PUT(request: Request, { params }: Params) {
  const id = parseInt(params.id, 10)
  const body = await request.json()

  const { email, name: newName, role: newRole } = body

  const data: { email?: string; name?: string; role?: Role } = {}

  if (email) {
    data.email = email
  }
  if (newName !== undefined) {
    data.name = newName
  }
  if (newRole !== undefined) {
    if (newRole !== Role.Employee && newRole !== Role.Admin) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }
    data.role = newRole as Role
  }

  const updated = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      // isLocked: true,
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: Params) {
  const id = parseInt(params.id, 10)
  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
