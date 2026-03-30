import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { PlaylistGrid } from "@/components/dashboard/PlaylistGrid"
import { LikedSongsCard } from "@/components/dashboard/LikedSongsCard"
import { getServerAuth } from "@/lib/server/auth"
import { XCircle } from "lucide-react"
import { getPlaylists, getSavedTracks } from "@/lib/server/actions"

export default async function DashboardPage() {
  const { user, isAuthenticated } = await getServerAuth()

  if (!isAuthenticated || !user) {
    redirect("/?error=authentication_required")
  }

  let playlists
  let savedTracksTotal = 0

  try {
    const [playlistsData, savedTracksData] = await Promise.all([
      getPlaylists(),
      getSavedTracks(0, 1),
    ])
    playlists = playlistsData
    savedTracksTotal = savedTracksData.total
  } catch (error) {
    return (
      <div className="min-h-screen p-xl bg-bg-primary">
        <DashboardHeader user={user} />
        <main className="max-w-[1200px] mx-auto flex justify-center">
          <div className="w-full max-w-md bg-white/[0.02] border border-border backdrop-blur-[10px] rounded-2xl p-2xl text-center">
            <XCircle className="w-12 h-12 text-semantic-error mx-auto mb-lg" />
            <h2 className="text-xl font-semibold text-text-primary mb-sm">Failed to load playlists</h2>
            <p className="text-sm text-text-secondary mb-xl">
              We couldn&apos;t load your playlists. This might be a temporary issue.
            </p>
            <a
              href="/dashboard"
              className="inline-flex items-center justify-center w-full px-lg py-md bg-white/10 border border-border rounded-lg text-text-primary text-sm font-medium hover:bg-white/20 transition-colors"
            >
              Try Again
            </a>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-xl bg-bg-primary">
      <DashboardHeader user={user} />

      <main className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-xl">
          <div>
            <h2 className="text-4xl font-semibold tracking-normal text-text-primary mb-base">
              Your Playlists
            </h2>
            <div className="flex gap-2xl">
              <div className="text-sm text-text-quaternary tracking-wide">
                <span className="text-accent-green font-semibold">{playlists.length}</span>{" "}
                Playlists
              </div>
              <div className="text-sm text-text-quaternary tracking-wide">
                <span className="text-accent-green font-semibold">
                  {playlists.reduce((acc, p) => acc + p.trackCount, 0)}
                </span>{" "}
                Tracks
              </div>
              <div className="text-sm text-text-quaternary tracking-wide">
                <span className="text-pink-500 font-semibold">{savedTracksTotal}</span>{" "}
                Liked
              </div>
            </div>
          </div>
        </div>

        <section className="mb-2xl">
          <PlaylistGrid playlists={playlists}>
            <LikedSongsCard totalTracks={savedTracksTotal} />
          </PlaylistGrid>
        </section>
      </main>
    </div>
  )
}
