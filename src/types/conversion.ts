export type TargetPlatform = "YOUTUBE" | "SPOTIFY"

export type ConversionStatus =
  | "PENDING"
  | "FETCHING"
  | "MATCHING"
  | "CREATING"
  | "COMPLETED"
  | "FAILED"

export type CreateConversionRequest = {
  sourcePlaylistId: string
  targetPlatform: TargetPlatform
  targetPlaylistName: string
  selectedTrackIds?: string[]
}

export type CreateConversionResponse = {
  jobId: string
  status: ConversionStatus
}

export type ConversionStatusResponse = {
  jobId: string
  status: ConversionStatus
  progress: number
  totalTracks: number
  processedTracks: number
  matchedTracks: number
  failedTracks: number
  estimatedSecondsRemaining: number | null
  targetPlaylistUrl: string | null
  error: string | null
}
