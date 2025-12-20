"use client"

import { useState, useTransition } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { TrackRowSkeleton } from "@/components/ui/Skeleton"
import type { Track } from "@/types/spotify"

type PlaylistTracksTableProps = {
  initialTracks: Track[]
  initialTotal: number
  initialHasNext: boolean
  playlistId: string
  fetchTracks: (playlistId: string, offset: number, limit: number) => Promise<{
    items: Track[]
    total: number
    hasNext: boolean
  }>
}

const TRACKS_PER_PAGE = 50

export function PlaylistTracksTable({
  initialTracks,
  initialTotal,
  initialHasNext,
  playlistId,
  fetchTracks,
}: PlaylistTracksTableProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [tracks, setTracks] = useState(initialTracks)
  const [total, setTotal] = useState(initialTotal)
  const [hasNext, setHasNext] = useState(initialHasNext)
  const [isPending, startTransition] = useTransition()

  const formatDuration = (durationMs: number) => {
    const minutes = Math.floor(durationMs / 60000)
    const seconds = Math.floor((durationMs % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1
      startTransition(async () => {
        const data = await fetchTracks(playlistId, newPage * TRACKS_PER_PAGE, TRACKS_PER_PAGE)
        setTracks(data.items)
        setTotal(data.total)
        setHasNext(data.hasNext)
        setCurrentPage(newPage)
      })
    }
  }

  const handleNextPage = () => {
    if (hasNext) {
      const newPage = currentPage + 1
      startTransition(async () => {
        const data = await fetchTracks(playlistId, newPage * TRACKS_PER_PAGE, TRACKS_PER_PAGE)
        setTracks(data.items)
        setTotal(data.total)
        setHasNext(data.hasNext)
        setCurrentPage(newPage)
      })
    }
  }

  const totalPages = Math.ceil(total / TRACKS_PER_PAGE)
  const startTrack = currentPage * TRACKS_PER_PAGE + 1
  const endTrack = Math.min((currentPage + 1) * TRACKS_PER_PAGE, total)

  return (
    <>
      <table className="w-full border-collapse">
        <thead className="border-b border-border">
          <tr>
            <th className="text-left text-xs uppercase tracking-wider text-text-quaternary font-medium p-base px-md">
              #
            </th>
            <th className="text-left text-xs uppercase tracking-wider text-text-quaternary font-medium p-base px-md">
              Title
            </th>
            <th className="text-left text-xs uppercase tracking-wider text-text-quaternary font-medium p-base px-md">
              Album
            </th>
            <th className="text-left text-xs uppercase tracking-wider text-text-quaternary font-medium p-base px-md">
              Duration
            </th>
          </tr>
        </thead>
        <tbody>
          {isPending ? (
            Array.from({ length: 10 }).map((_, i) => <TrackRowSkeleton key={i} />)
          ) : (
            tracks.map((track, index) => (
              <tr
                key={track.id}
                className="transition-all duration-fast hover:bg-accent-green/5"
              >
                <td className="text-text-quaternary w-[60px] font-[tabular-nums] p-base px-md border-b border-white/[0.04] text-sm">
                  {startTrack + index}
                </td>
                <td className="p-base px-md border-b border-white/[0.04] text-sm">
                  <div className="flex items-center gap-base">
                    <div
                      className="w-12 h-12 rounded-md flex-shrink-0 shadow-[0_4px_12px_rgba(59,130,246,0.2)]"
                      style={{
                        backgroundImage: track.imageUrl
                          ? `url(${track.imageUrl})`
                          : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div>
                      <div className="text-text-primary mb-xs font-medium">{track.name}</div>
                      <div className="text-text-quaternary text-sm">{track.artist}</div>
                    </div>
                  </div>
                </td>
                <td className="text-text-quaternary p-base px-md border-b border-white/[0.04] text-sm">
                  {track.album}
                </td>
                <td className="text-text-quaternary text-right font-[tabular-nums] p-base px-md border-b border-white/[0.04] text-sm">
                  {formatDuration(track.durationMs)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex justify-between items-center py-xl mt-xl">
          <div className="text-sm text-text-quaternary">
            Showing {startTrack}-{endTrack} of {total} tracks
          </div>
          <div className="flex gap-base items-center">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0 || isPending}
              className="flex items-center gap-sm px-base py-sm glass-effect text-text-primary rounded-lg cursor-pointer transition-all duration-base text-sm font-medium hover:bg-white/10 hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
              Previous
            </button>
            <div className="text-sm text-text-secondary px-base">
              Page {currentPage + 1} of {totalPages}
            </div>
            <button
              onClick={handleNextPage}
              disabled={!hasNext || isPending}
              className="flex items-center gap-sm px-base py-sm glass-effect text-text-primary rounded-lg cursor-pointer transition-all duration-base text-sm font-medium hover:bg-white/10 hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
