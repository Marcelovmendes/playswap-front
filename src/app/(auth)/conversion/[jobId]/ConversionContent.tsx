"use client"

import { useState } from "react"
import * as Progress from "@radix-ui/react-progress"
import { CheckCircle, XCircle, Loader2, ExternalLink, Music, ArrowLeft, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { useConversionStatus } from "@/lib/hooks/useConversionStatus"
import { parseConversionError } from "@/lib/errors/errorMessages"
import type { ConversionStatus } from "@/types/conversion"

type ConversionContentProps = {
  jobId: string
  playlistName: string
  playlistImage?: string
  totalTracks?: number
  sourcePlaylistId?: string
}

const statusLabels: Record<ConversionStatus, string> = {
  PENDING: "Waiting to start...",
  FETCHING: "Fetching playlist tracks...",
  MATCHING: "Matching tracks on YouTube...",
  CREATING: "Creating YouTube playlist...",
  COMPLETED: "Conversion completed!",
  FAILED: "Conversion failed",
}

function getStatusColor(status: ConversionStatus | undefined): string {
  if (!status || status === "PENDING" || status === "FETCHING") {
    return "text-accent-blue"
  }
  if (status === "MATCHING" || status === "CREATING") {
    return "text-accent-green"
  }
  if (status === "COMPLETED") {
    return "text-semantic-success"
  }
  if (status === "FAILED") {
    return "text-semantic-error"
  }
  return "text-accent-blue"
}

function StatusIcon({ status, isLoading }: { status: ConversionStatus | undefined; isLoading: boolean }) {
  if (isLoading || !status || status === "PENDING" || status === "FETCHING") {
    return <Loader2 className="w-8 h-8 animate-spin text-accent-blue" />
  }
  if (status === "MATCHING" || status === "CREATING") {
    return <Loader2 className="w-8 h-8 animate-spin text-accent-green" />
  }
  if (status === "COMPLETED") {
    return <CheckCircle className="w-8 h-8 text-semantic-success animate-[scale-bounce_0.3s_ease-out]" />
  }
  if (status === "FAILED") {
    return <XCircle className="w-8 h-8 text-semantic-error" />
  }
  return null
}

function PlaylistImage({ imageUrl, playlistName }: { imageUrl?: string; playlistName: string }) {
  const initials = playlistName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  if (imageUrl) {
    return (
      <div
        className="w-24 h-24 rounded-xl bg-cover bg-center shadow-lg"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
    )
  }

  return (
    <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-accent-green to-emerald-700 flex items-center justify-center shadow-lg">
      <span className="text-2xl font-bold text-white">{initials || <Music className="w-8 h-8" />}</span>
    </div>
  )
}

export function ConversionContent({ jobId, playlistName, playlistImage, totalTracks, sourcePlaylistId }: ConversionContentProps) {
  const { status, isLoading, isCompleted, isFailed, isTerminal } = useConversionStatus(jobId)
  const [copied, setCopied] = useState(false)

  const progress = status?.progress ?? 0
  const currentStatus = status?.status

  const handleCloseTab = () => {
    window.close()
  }

  const handleCopyLink = async () => {
    if (!status?.targetPlaylistUrl) return

    try {
      await navigator.clipboard.writeText(status.targetPlaylistUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-xl">
      <div className="w-full max-w-md bg-white/[0.02] border border-border backdrop-blur-[10px] rounded-2xl p-2xl">
        <div className="flex items-center gap-lg mb-2xl">
          <PlaylistImage imageUrl={playlistImage} playlistName={playlistName} />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-text-tertiary uppercase tracking-wider mb-xs">Converting</p>
            <h1 className="text-lg font-semibold text-text-primary truncate">{playlistName}</h1>
            <p className="text-sm text-text-secondary">→ YouTube Music</p>
          </div>
        </div>

        <div className="text-center mb-xl">
          <div
            className={cn(
              "text-[56px] font-bold leading-none mb-sm transition-all duration-300",
              isCompleted
                ? "text-semantic-success"
                : isFailed
                ? "text-semantic-error"
                : "bg-gradient-to-r from-accent-blue to-accent-blue-light bg-clip-text text-transparent"
            )}
          >
            {progress}%
          </div>
          <div className="flex items-center justify-center gap-sm">
            <StatusIcon status={currentStatus} isLoading={isLoading} />
            <span className={cn("text-sm font-medium", getStatusColor(currentStatus))}>
              {isLoading ? "Loading..." : statusLabels[currentStatus ?? "PENDING"]}
            </span>
          </div>
        </div>

        <div className="mb-xl">
          <Progress.Root
            className="relative h-3 w-full overflow-hidden rounded-full bg-white/10"
            value={progress}
          >
            <Progress.Indicator
              className={cn(
                "h-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                isFailed
                  ? "bg-semantic-error"
                  : isCompleted
                  ? "bg-semantic-success"
                  : "bg-gradient-to-r from-accent-blue to-accent-blue-light"
              )}
              style={{ width: `${progress}%` }}
            />
          </Progress.Root>
        </div>

        {status && (
          <div className="grid grid-cols-3 gap-md mb-xl">
            <div className="glass-effect rounded-lg p-md text-center">
              <div className="text-xl font-bold text-accent-green">{status.matchedTracks}</div>
              <div className="text-xs text-text-tertiary">Matched</div>
            </div>
            <div className="glass-effect rounded-lg p-md text-center">
              <div className="text-xl font-bold text-semantic-warning">{status.failedTracks}</div>
              <div className="text-xs text-text-tertiary">Not Found</div>
            </div>
            <div className="glass-effect rounded-lg p-md text-center">
              <div className="text-xl font-bold text-text-secondary">
                {status.processedTracks}/{totalTracks ?? status.totalTracks}
              </div>
              <div className="text-xs text-text-tertiary">Processed</div>
            </div>
          </div>
        )}

        {isFailed && status?.error && (() => {
          const conversionError = parseConversionError(status.error, status.status)
          return (
            <div className="p-md bg-semantic-error/10 border border-semantic-error/30 rounded-lg mb-xl">
              <p className="text-sm font-medium text-semantic-error mb-xs">{conversionError.title}</p>
              <p className="text-sm text-semantic-error/80">{conversionError.message}</p>
            </div>
          )
        })()}

        {isCompleted && status?.targetPlaylistUrl && (
          <div className="mb-md">
            <p className="text-xs text-text-tertiary uppercase tracking-wider mb-sm text-center">
              Your playlist is ready
            </p>
            <div className="flex items-center gap-sm mb-md">
              <div className="flex-1 bg-white/5 border border-border rounded-lg px-md py-sm overflow-hidden">
                <p className="text-sm text-text-secondary truncate">{status.targetPlaylistUrl}</p>
              </div>
              <button
                onClick={handleCopyLink}
                className={cn(
                  "p-sm rounded-lg border transition-all duration-200",
                  copied
                    ? "bg-semantic-success/20 border-semantic-success/30 text-semantic-success"
                    : "bg-white/5 border-border text-text-secondary hover:text-text-primary hover:bg-white/10"
                )}
                title={copied ? "Copied!" : "Copy link"}
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <a
              href={status.targetPlaylistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Button variant="primary" fullWidth>
                Open in YouTube Music
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          </div>
        )}

        {isTerminal && (
          <div className="flex flex-col gap-sm">
            {isFailed && sourcePlaylistId && (
              <a href={`/playlist/${sourcePlaylistId}`} className="block w-full">
                <Button variant="primary" fullWidth>
                  Try Again
                </Button>
              </a>
            )}
            <Button variant="secondary" fullWidth onClick={handleCloseTab}>
              <ArrowLeft className="w-4 h-4" />
              Close Tab
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
