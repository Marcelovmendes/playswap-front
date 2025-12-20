import { useQuery } from "@tanstack/react-query"
import { spotifyApi } from "@/lib/api/spotify"

export function usePlaylists() {
  return useQuery({
    queryKey: ["playlists"],
    queryFn: spotifyApi.playlists.getUserPlaylists,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
