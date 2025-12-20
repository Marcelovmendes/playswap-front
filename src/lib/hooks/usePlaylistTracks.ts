import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"
import type { Track } from "@/types/spotify"

type PlaylistTracksResponse = {
  items: Track[]
  total: number
  limit: number
  offset: number
  hasNext: boolean
}

async function fetchPlaylistTracks(
  playlistId: string,
  offset: number = 0,
  limit: number = 50
): Promise<PlaylistTracksResponse> {
  const response = await apiClient.get<PlaylistTracksResponse>(
    `/api/spotify/v1/playlist/${playlistId}/tracks`,
    {
      params: { offset, limit },
    }
  )
  return response.data
}

export function usePlaylistTracks(playlistId: string, offset: number = 0, limit: number = 50) {
  return useQuery({
    queryKey: ["playlist-tracks", playlistId, offset, limit],
    queryFn: () => fetchPlaylistTracks(playlistId, offset, limit),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
