import { useState, useEffect, useCallback } from "react"
import { youtubeApi } from "@/lib/api/youtube"
import { spotifyApi } from "@/lib/api/spotify"
import { toastEvents } from "@/lib/events/toastEvents"

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
    function handleStorage(e: StorageEvent) {
      if (e.key === "youtube_auth" && e.newValue) {
        localStorage.removeItem("youtube_auth")
        ;(async () => {
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
          setIsConnecting(false)
        })()
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
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
