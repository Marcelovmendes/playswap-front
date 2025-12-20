import axios from "axios"

export const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8080",
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
