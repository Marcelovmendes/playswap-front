import { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type SkeletonProps = HTMLAttributes<HTMLDivElement>

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-white/[0.06] relative overflow-hidden",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:animate-[shimmer_2s_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-white/[0.08] before:to-transparent",
        className
      )}
      {...props}
    />
  )
}

export function PlaylistCardSkeleton() {
  return (
    <div className="relative bg-white/[0.02] border border-border rounded-xl p-lg">
      <Skeleton className="w-full aspect-square rounded-lg mb-md" />
      <div className="py-sm space-y-sm">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}

export function TrackRowSkeleton() {
  return (
    <tr className="border-b border-white/[0.04]">
      <td className="p-base px-md">
        <Skeleton className="h-4 w-8" />
      </td>
      <td className="p-base px-md">
        <div className="flex items-center gap-base">
          <Skeleton className="w-12 h-12 rounded-md flex-shrink-0" />
          <div className="flex-1 space-y-sm">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </td>
      <td className="p-base px-md">
        <Skeleton className="h-4 w-40" />
      </td>
      <td className="p-base px-md text-right">
        <Skeleton className="h-4 w-12 ml-auto" />
      </td>
    </tr>
  )
}
