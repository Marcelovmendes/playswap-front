import axios from "axios"
import { toastEvents } from "@/lib/events/toastEvents"

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || "http://127.0.0.1:8080"

export const apiClient = axios.create({
  baseURL: GATEWAY_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isAuthRoute = error.config?.url?.includes("/api/auth")

    if (error.response?.status === 401 && !isAuthRoute) {
      if (typeof window !== "undefined") {
        toastEvents.emit({
          message: "Sua sessão expirou. Faça login novamente.",
          variant: "error",
        })

        const { useAuthStore } = await import("@/store/authStore")
        const { logout } = useAuthStore.getState()
        await logout()

        if (window.location.pathname !== "/") {
          window.location.href = "/?error=session_expired"
        }
      }
    }
    return Promise.reject(error)
  }
)
