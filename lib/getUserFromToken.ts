import { jwtDecode } from "jwt-decode";

export function getUserFromToken(): { name?: string; email?: string; role?: string } | null {
  if (typeof document === "undefined") return null;  
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
  const token = cookies['auth_token'];
  if (!token) return null;
  try {
    return jwtDecode(token) as { name?: string; email?: string; role?: string };
  } catch {
    return null;
  }
}