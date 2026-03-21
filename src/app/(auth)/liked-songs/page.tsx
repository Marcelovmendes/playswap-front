import { redirect } from "next/navigation"
import { Heart } from "lucide-react"
import { SavedTracksTable } from "@/components/playlist/SavedTracksTable"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { getServerAuth } from "@/lib/server/auth"
import { getSavedTracks } from "@/lib/server/actions"

export default async function LikedSongsPage() {
  const { user, isAuthenticated } = await getServerAuth()

  if (!isAuthenticated || !user) {
    redirect("/?error=authentication_required")
  }

  const tracksData = await getSavedTracks(0, 50)

  return (
    <div className="min-h-screen p-xl bg-bg-primary">
      <DashboardHeader user={user} />

      <div className="flex gap-2xl py-2xl border-b border-border mb-2xl">
        <div className="w-60 h-60 flex-shrink-0 flex items-center justify-center rounded-xl relative overflow-hidden shadow-[0_20px_60px_rgba(236,72,153,0.3)] bg-gradient-to-br from-purple-600 via-pink-500 to-pink-600">
          <div className="absolute inset-0 grid-pattern opacity-20" />
          <Heart size={96} className="text-white z-10" fill="white" />
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-xs uppercase tracking-[2px] text-pink-500 mb-md font-semibold">
            ♥ Collection
          </div>
          <h2 className="text-5xl font-bold tracking-normal mb-base text-text-primary">
            Liked Songs
          </h2>
          <p className="text-sm text-text-secondary mb-lg max-w-[600px] leading-relaxed">
            All the songs you&apos;ve liked on Spotify
          </p>
          <div className="flex gap-xl text-sm text-text-quaternary">
            <span className="flex items-center gap-[6px]">
              <span className="text-pink-500 font-semibold">{tracksData.total}</span> tracks
            </span>
          </div>
        </div>
      </div>

      <SavedTracksTable
        initialTracks={tracksData.items}
        initialTotal={tracksData.total}
        initialHasNext={tracksData.hasNext}
        fetchTracks={getSavedTracks}
      />
    </div>
  )
}
