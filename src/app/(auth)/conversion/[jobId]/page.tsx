import { redirect } from "next/navigation"
import { getServerAuth } from "@/lib/server/auth"
import { ConversionContent } from "./ConversionContent"

type PageProps = {
  params: Promise<{ jobId: string }>
  searchParams: Promise<{
    playlistName?: string
    playlistImage?: string
    totalTracks?: string
  }>
}

export default async function ConversionPage({ params, searchParams }: PageProps) {
  const { isAuthenticated } = await getServerAuth()

  if (!isAuthenticated) {
    redirect("/?error=authentication_required")
  }

  const { jobId } = await params
  const { playlistName, playlistImage, totalTracks } = await searchParams

  return (
    <ConversionContent
      jobId={jobId}
      playlistName={playlistName ?? "Playlist"}
      playlistImage={playlistImage}
      totalTracks={totalTracks ? parseInt(totalTracks, 10) : undefined}
    />
  )
}
