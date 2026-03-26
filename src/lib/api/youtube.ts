import axios from "axios"

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || "http://127.0.0.1:8080"

const youtubeAuthClient = axios.create({
  baseURL: GATEWAY_URL,
  withCredentials: true,
})

type AuthResponse = {
  authorizationUrl: string
}

type SessionResponse = {
  sessionId: string
}

export const youtubeApi = {
  auth: {
    initiateLogin: async () => {
      const response = await youtubeAuthClient.get<AuthResponse>("/v1/auth")
      const googleAuthUrl = response.data.authorizationUrl
      if (googleAuthUrl) {
        const width = 500
        const height = 700
        const left = window.screenX + (window.outerWidth - width) / 2
        const top = window.screenY + (window.outerHeight - height) / 2
        window.open(googleAuthUrl, "youtube-auth", `width=${width},height=${height},left=${left},top=${top}`)
      }
    },
    getSession: async (): Promise<string> => {
      const response = await youtubeAuthClient.get<SessionResponse>("/api/auth/youtube/session")
      return response.data.sessionId
    },
  },
}
