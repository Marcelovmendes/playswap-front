"use client"

import { useRouter } from "next/navigation"
import { Music } from "lucide-react"
import { Card } from "@/components/ui/Card"
import type { Playlist } from "@/types/spotify"

type PlaylistGridProps = {
  playlists: Playlist[]
}

export function PlaylistGrid({ playlists }: PlaylistGridProps) {
  const router = useRouter()

  if (playlists.length === 0) {
    return (
      <div className="text-center p-3xl">
        <Music className="w-16 h-16 text-text-tertiary mx-auto mb-lg" />
        <p className="text-lg text-text-secondary">No playlists found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-lg">
      {playlists.map((playlist) => (
        <Card
          key={playlist.id}
          padding="md"
          hover
          onClick={() => router.push(`/playlist/${playlist.id}`)}
        >
          <div
            className="w-full aspect-square rounded-lg bg-gradient-primary flex items-center justify-center mb-md relative overflow-hidden"
            style={{
              backgroundImage: playlist.imageUrl
                ? `url(${playlist.imageUrl})`
                : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {!playlist.imageUrl && (
              <>
                <div className="absolute inset-0 grid-pattern opacity-30" />
                <Music size={48} className="text-white/90 z-10" />
              </>
            )}
          </div>
          <div className="py-sm">
            <h4 className="text-lg font-semibold text-text-primary mb-xs overflow-hidden text-ellipsis whitespace-nowrap">
              {playlist.name}
            </h4>
            <p className="text-sm text-text-quaternary flex gap-md">
              <span>{playlist.trackCount} tracks</span>
              <span>·</span>
              <span>{playlist.ownerName}</span>
            </p>
          </div>
        </Card>
      ))}
    </div>
  )
}
