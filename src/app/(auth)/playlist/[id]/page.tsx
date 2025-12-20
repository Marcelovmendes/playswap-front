import { redirect } from "next/navigation"
import { PlaylistTracksTable } from "@/components/playlist/PlaylistTracksTable"
import { PlaylistActions } from "@/components/playlist/PlaylistActions"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { getServerAuth } from "@/lib/server/auth"
import { getPlaylists, getPlaylistTracks } from "@/lib/server/actions"

type PageProps = {
  params: Promise<{ id: string }>
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default async function PlaylistPreviewPage({ params }: PageProps) {
  const { user, isAuthenticated } = await getServerAuth()

  if (!isAuthenticated || !user) {
    redirect("/?error=authentication_required")
  }

  const { id: playlistId } = await params
  const playlists = await getPlaylists()
  const playlist = playlists.find((p) => p.id === playlistId)

  if (!playlist) {
    return (
      <div className="min-h-screen p-xl bg-bg-primary">
        <DashboardHeader user={user} />
        <div className="p-lg bg-red-500/10 border border-red-500/30 rounded-lg text-semantic-error text-center">
          Playlist not found
        </div>
      </div>
    )
  }

  const tracksData = await getPlaylistTracks(playlistId, 0, 50)

  return (
    <div className="min-h-screen p-xl bg-bg-primary">
      <DashboardHeader user={user} />

      <div className="flex gap-2xl py-2xl border-b border-border mb-2xl">
        <div
          className="w-60 h-60 flex-shrink-0 flex items-center justify-center rounded-xl relative overflow-hidden shadow-[0_20px_60px_rgba(16,185,129,0.3)]"
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
              <div className="text-[96px] font-bold text-white/90 tracking-[-3px] z-10">
                {getInitials(playlist.name)}
              </div>
            </>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-xs uppercase tracking-[2px] text-accent-green mb-md font-semibold">
            ⚡ Playlist
          </div>
          <h2 className="text-5xl font-bold tracking-normal mb-base text-text-primary">
            {playlist.name}
          </h2>
          {playlist.description && (
            <p className="text-sm text-text-secondary mb-lg max-w-[600px] leading-relaxed">
              {playlist.description}
            </p>
          )}
          <div className="flex gap-xl text-sm text-text-quaternary">
            <span className="flex items-center gap-[6px]">
              Created by{" "}
              <span className="text-accent-green font-semibold">{playlist.ownerName}</span>
            </span>
            <span className="flex items-center gap-[6px]">
              <span className="text-accent-green font-semibold">{playlist.trackCount}</span> tracks
            </span>
          </div>
        </div>
      </div>

      <PlaylistTracksTable
        initialTracks={tracksData.items}
        initialTotal={tracksData.total}
        initialHasNext={tracksData.hasNext}
        playlistId={playlistId}
        fetchTracks={getPlaylistTracks}
      />

      <PlaylistActions playlistId={playlistId} />
    </div>
  )
}
