"use client"

import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"
import { Card } from "@/components/ui/Card"

type LikedSongsCardProps = {
  totalTracks: number
}

export function LikedSongsCard({ totalTracks }: LikedSongsCardProps) {
  const router = useRouter()

  return (
    <Card
      padding="md"
      hover
      onClick={() => router.push("/liked-songs")}
    >
      <div className="w-full aspect-square rounded-lg flex items-center justify-center mb-md relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-pink-600">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <Heart size={48} className="text-white z-10" fill="white" />
      </div>
      <div className="py-sm">
        <h4 className="text-lg font-semibold text-text-primary mb-xs overflow-hidden text-ellipsis whitespace-nowrap">
          Liked Songs
        </h4>
        <p className="text-sm text-text-quaternary">
          {totalTracks} tracks
        </p>
      </div>
    </Card>
  )
}
