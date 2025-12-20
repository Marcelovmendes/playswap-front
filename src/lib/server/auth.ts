import { cookies } from "next/headers"
import type { UserProfile } from "@/types/spotify"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080"

export async function getServerAuth() {
  const cookieStore = cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ")

  if (!cookieHeader) {
    return { user: null, isAuthenticated: false }
  }

  try {
    const response = await fetch(`${API_URL}/api/spotify/v1/users/details`, {
      headers: {
        Cookie: cookieHeader,
      },
      credentials: "include",
      cache: "no-store",
    })

    if (!response.ok) {
      return { user: null, isAuthenticated: false }
    }

    const user: UserProfile = await response.json()
    return { user, isAuthenticated: true }
  } catch (error) {
    console.error("Server auth check failed:", error)
    return { user: null, isAuthenticated: false }
  }
}
