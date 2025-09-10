import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { redirect } from 'next/navigation'
import { AdminNavbar } from '@/components/admin-navbar';
import { SelectedCountryProvider } from '@/components/SelectedCountryContext';
import AdminLayoutClient from '@/components/AdminLayoutClient';

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) redirect('/admin/auth/login')

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    if (payload.role !== 'Admin') redirect('/admin/auth/login')
  } catch {
    redirect('/admin/auth/login')
  }

  return <SelectedCountryProvider>
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <AdminLayoutClient>
        <main className="pt-16">{children}</main>
      </AdminLayoutClient>
    </div>
  </SelectedCountryProvider>
}