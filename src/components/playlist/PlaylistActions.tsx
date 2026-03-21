"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Youtube, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useYoutubeAuth } from "@/lib/hooks/useYoutubeAuth"
import { spotifyApi } from "@/lib/api/spotify"

type PlaylistActionsProps = {
  playlistId: string
  playlistName: string
  playlistImage?: string
  totalTracks: number
}

export function PlaylistActions({
  playlistId,
  playlistName,
  playlistImage,
  totalTracks,
}: PlaylistActionsProps) {
  const router = useRouter()
  const [isCreatingJob, setIsCreatingJob] = useState(false)
  const youtubeAuth = useYoutubeAuth()
  const hasTriggeredConversion = useRef(false)

  const startConversion = async () => {
    if (isCreatingJob) return

    setIsCreatingJob(true)
    try {
      const response = await spotifyApi.conversions.create({
        sourcePlaylistId: playlistId,
        targetPlatform: "YOUTUBE",
        targetPlaylistName: `${playlistName} (YouTube)`,
      })

      const searchParams = new URLSearchParams({
        playlistName,
        totalTracks: totalTracks.toString(),
      })
      if (playlistImage) {
        searchParams.set("playlistImage", playlistImage)
      }

      window.open(`/conversion/${response.jobId}?${searchParams.toString()}`, "_blank")
    } catch (error) {
      console.error("Failed to create conversion job:", error)
    } finally {
      setIsCreatingJob(false)
    }
  }

  const wasConnectingRef = useRef(false)

  useEffect(() => {
    if (youtubeAuth.isConnecting) {
      wasConnectingRef.current = true
    }
  }, [youtubeAuth.isConnecting])

  useEffect(() => {
    const authenticatedViaPopup = wasConnectingRef.current && youtubeAuth.isAuthenticated
    if (authenticatedViaPopup && !hasTriggeredConversion.current && !isCreatingJob) {
      hasTriggeredConversion.current = true
      startConversion()
    }
  }, [youtubeAuth.isAuthenticated])

  const handleBack = () => {
    router.push("/dashboard")
  }

  const handleConvert = () => {
    if (youtubeAuth.isAuthenticated) {
      startConversion()
    } else {
      youtubeAuth.connect()
    }
  }

  const isLoading = youtubeAuth.isCheckingSession || youtubeAuth.isConnecting || isCreatingJob

  return (
    <div className="flex justify-between items-center py-xl border-t border-border mt-2xl">
      <Button variant="secondary" size="md" onClick={handleBack}>
        <ArrowLeft size={20} />
        Back to Playlists
      </Button>

      <div className="flex items-center gap-md">
        <Button
          variant="gradient"
          size="md"
          onClick={handleConvert}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {youtubeAuth.isCheckingSession
                ? "Checking..."
                : youtubeAuth.isConnecting
                  ? "Connecting..."
                  : "Starting..."}
            </>
          ) : youtubeAuth.isAuthenticated ? (
            "Convert to YouTube"
          ) : (
            <>
              <Youtube className="w-5 h-5" />
              Connect & Convert
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
