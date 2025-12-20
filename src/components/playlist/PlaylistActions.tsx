"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/Button"

type PlaylistActionsProps = {
  playlistId: string
}

export function PlaylistActions({ playlistId }: PlaylistActionsProps) {
  const router = useRouter()

  const handleBack = () => {
    router.push("/dashboard")
  }

  const handleConvert = () => {
    console.log("Converting playlist:", playlistId)
  }

  return (
    <div className="flex justify-between items-center py-xl border-t border-border mt-2xl">
      <Button variant="secondary" size="md" onClick={handleBack}>
        <ArrowLeft size={20} />
        Back to Playlists
      </Button>
      <Button variant="gradient" size="md" onClick={handleConvert}>
        Convert to YouTube
      </Button>
    </div>
  )
}
