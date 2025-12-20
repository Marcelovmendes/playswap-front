import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { PlaylistGrid } from "@/components/dashboard/PlaylistGrid"
import { getServerAuth } from "@/lib/server/auth"
import { getPlaylists } from "@/lib/server/actions"

export default async function DashboardPage() {
  const { user, isAuthenticated } = await getServerAuth()

  if (!isAuthenticated || !user) {
    redirect("/?error=authentication_required")
  }

  let playlists
  try {
    playlists = await getPlaylists()
  } catch (error) {
    return (
      <div className="min-h-screen p-xl bg-bg-primary">
        <DashboardHeader user={user} />
        <main className="max-w-[1200px] mx-auto">
          <div className="p-lg bg-red-500/10 border border-red-500/30 rounded-lg text-semantic-error text-center">
            Failed to load playlists. Please try again later.
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
            </div>
          </div>
        </div>

        <section className="mb-2xl">
          <PlaylistGrid playlists={playlists} />
        </section>
      </main>
    </div>
  )
}
