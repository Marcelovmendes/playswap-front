import { useQuery } from "@tanstack/react-query"
import { spotifyApi } from "@/lib/api/spotify"
import type { ConversionStatusResponse } from "@/types/conversion"

const POLLING_INTERVAL = 1500

export function useConversionStatus(jobId: string) {
  const query = useQuery({
    queryKey: ["conversion-status", jobId],
    queryFn: () => spotifyApi.conversions.getStatus(jobId),
    refetchInterval: (query) => {
      const data = query.state.data as ConversionStatusResponse | undefined
      if (!data) return POLLING_INTERVAL
      if (data.status === "COMPLETED" || data.status === "FAILED") {
        return false
      }
      return POLLING_INTERVAL
    },
  })

  return {
    status: query.data,
    isLoading: query.isLoading,
    error: query.error,
    isCompleted: query.data?.status === "COMPLETED",
    isFailed: query.data?.status === "FAILED",
    isTerminal: query.data?.status === "COMPLETED" || query.data?.status === "FAILED",
  }
}
