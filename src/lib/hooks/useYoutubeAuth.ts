import { useState, useEffect, useCallback } from "react"
import { youtubeApi } from "@/lib/api/youtube"
import { spotifyApi } from "@/lib/api/spotify"
import { toastEvents } from "@/lib/events/toastEvents"

type YouTubeAuthMessage = {
  type: "YOUTUBE_AUTH_CALLBACK"
  status: "success" | "error"
  error: string | null
}

function isYouTubeAuthMessage(data: unknown): data is YouTubeAuthMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    (data as YouTubeAuthMessage).type === "YOUTUBE_AUTH_CALLBACK"
  )
}

export function useYoutubeAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkSession = useCallback(async () => {
    setIsCheckingSession(true)
    try {
      const youtubeSessionId = await youtubeApi.auth.getSession()
      if (youtubeSessionId) {
        await spotifyApi.auth.linkYoutube(youtubeSessionId)
        setIsAuthenticated(true)
      }
    } catch {
      // No existing session, user needs to authenticate
    } finally {
      setIsCheckingSession(false)
    }
  }, [])

  const connect = useCallback(async () => {
    if (isConnecting) {
      return
    }
    setIsConnecting(true)
    setError(null)
    try {
      await youtubeApi.auth.initiateLogin()
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Não foi possível conectar ao YouTube. Tente novamente."
      setError(errorMessage)
      toastEvents.emit({ message: errorMessage, variant: "error" })
      setIsConnecting(false)
    }
  }, [isConnecting])

  const reset = useCallback(() => {
    setIsAuthenticated(false)
    setIsConnecting(false)
    setError(null)
  }, [])

  useEffect(() => {
    async function handleMessage(event: MessageEvent) {
      const allowedOrigins = [
        process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3000",
      ].filter(Boolean)

      if (!allowedOrigins.includes(event.origin)) {
        return
      }

      if (!isYouTubeAuthMessage(event.data)) {
        return
      }

      if (event.data.status === "success") {
        try {
          const youtubeSessionId = await youtubeApi.auth.getSession()
          await spotifyApi.auth.linkYoutube(youtubeSessionId)
          setIsAuthenticated(true)
          setError(null)
        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Falha ao vincular sessão do YouTube"
          setError(errorMessage)
          toastEvents.emit({ message: errorMessage, variant: "error" })
        }
      } else {
        const errorMessage = event.data.error || "Autenticação YouTube falhou"
        setError(errorMessage)
        toastEvents.emit({ message: errorMessage, variant: "error" })
      }

      setIsConnecting(false)
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  return {
    isAuthenticated,
    isConnecting,
    isCheckingSession,
    error,
    connect,
    checkSession,
    reset,
  }
}
