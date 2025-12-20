"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Music, Youtube } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { GradientHeading } from "@/components/ui/GradientHeading"
import { spotifyApi } from "@/lib/api/spotify"
import { apiClient } from "@/lib/api/client"

type SpotifyAuthMessage = {
  type: "SPOTIFY_AUTH_CALLBACK"
  status: "success" | "error"
  token: string | null
  error: string | null
}

function isSpotifyAuthMessage(data: unknown): data is SpotifyAuthMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    (data as SpotifyAuthMessage).type === "SPOTIFY_AUTH_CALLBACK"
  )
}

export default function LandingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isExchangingRef = useRef(false)

  const handleConnectSpotify = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await spotifyApi.auth.initiateLogin()
    } catch (error: any) {
      console.error("Error connecting to Spotify:", error)
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to connect to Spotify. Please check if the backend is running."
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    async function handleMessage(event: MessageEvent) {
      const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"]

      if (!allowedOrigins.includes(event.origin)) {
        return
      }

      if (!isSpotifyAuthMessage(event.data)) {
        return
      }

      if (event.data.status === "success") {
        if (!event.data.token) {
          setError("No token received from authentication")
          return
        }

        if (isExchangingRef.current) {
          return
        }

        isExchangingRef.current = true
        setIsLoading(true)

        try {
          await apiClient.post("/api/auth/exchange", {
            token: event.data.token,
          })

          router.push("/dashboard")
        } catch (error) {
          console.error("Auth exchange error:", error)
          setError("Failed to complete authentication")
          isExchangingRef.current = false
        } finally {
          setIsLoading(false)
        }
      } else if (event.data.status === "error") {
        setError(event.data.error || "Authentication failed")
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [router])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-2xl bg-bg-primary">
      <section className="min-h-[60vh] flex flex-col justify-center relative mb-xl">
        <div className="absolute -top-1/2 -right-[10%] w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(16,185,129,0.15)_0%,transparent_70%)] pointer-events-none animate-pulse" />
        <div className="absolute -bottom-[30%] -left-[10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(59,130,246,0.12)_0%,transparent_70%)] pointer-events-none animate-pulse-fast" />

        <div className="relative z-10 text-center max-w-[1200px] w-full mx-auto">
          <div className="inline-block text-sm tracking-wider uppercase text-accent-green bg-accent-green/10 border border-accent-green/30 px-base py-sm mb-2xl rounded-sm">
            ✨ Platform Bridge
          </div>
          <GradientHeading className="text-6xl mb-lg max-md:text-4xl">
            Transfer your playlists across platforms
          </GradientHeading>
          <p className="text-xl text-text-quaternary mb-xl max-w-[600px] mx-auto leading-normal">
            Convert Spotify playlists to YouTube Music seamlessly. Preserve your music collection
            across streaming services.
          </p>
          <div className="flex gap-base justify-center flex-wrap mt-2xl">
            <Button variant="primary" size="lg" onClick={handleConnectSpotify} disabled={isLoading}>
              <Music size={20} />
              {isLoading ? "Connecting..." : "Connect Spotify"}
            </Button>
            <Button variant="secondary" size="lg">
              Learn More
            </Button>
          </div>
          {error && (
            <div className="mt-md p-md bg-red-500/10 border border-red-500/30 rounded-lg text-[#ef4444] text-center max-w-[600px] mx-auto">
              {error}
            </div>
          )}
        </div>
      </section>

      <section className="max-w-[1200px] w-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-xl mt-2xl relative z-10">
        <Card padding="lg" className="flex flex-col items-center text-center">
          <div className="flex items-center gap-lg justify-center flex-wrap mb-lg">
            <div className="w-20 h-20 rounded-xl bg-[linear-gradient(135deg,#1DB954_0%,#1ed760_100%)] flex items-center justify-center text-white">
              <Music size={40} />
            </div>
            <ArrowRight className="text-accent-green w-8 h-8" />
            <div className="w-20 h-20 rounded-xl bg-[linear-gradient(135deg,#FF0000_0%,#cc0000_100%)] flex items-center justify-center text-white">
              <Youtube size={40} />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-sm text-text-primary">Seamless Conversion</h3>
          <p className="text-base text-text-secondary leading-relaxed">
            Transfer your playlists from Spotify to YouTube Music with just a few clicks.
          </p>
        </Card>

        <Card padding="lg" className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-xl bg-gradient-secondary flex items-center justify-center mb-lg">
            <Music size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-sm text-text-primary">Preserve Your Music</h3>
          <p className="text-base text-text-secondary leading-relaxed">
            Keep all your carefully curated playlists safe and accessible on multiple platforms.
          </p>
        </Card>

        <Card padding="lg" className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-xl bg-gradient-tertiary flex items-center justify-center mb-lg">
            <ArrowRight size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-sm text-text-primary">Fast & Reliable</h3>
          <p className="text-base text-text-secondary leading-relaxed">
            Our optimized conversion process ensures your playlists are transferred quickly and
            accurately.
          </p>
        </Card>
      </section>
    </main>
  )
}
