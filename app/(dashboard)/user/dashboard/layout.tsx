import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get('auth_token')?.value
  if (!token) redirect('/user/auth/login')
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    if (payload.role !== 'Employee') redirect('/user/auth/login')
  } catch {
    redirect('/user/auth/login')
  }
  return <>{children}</>
}