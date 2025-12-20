"use client"

import { useRouter } from "next/navigation"
import type { UserProfile } from "@/types/spotify"

type DashboardHeaderProps = {
  user: UserProfile
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()

  return (
    <header className="flex justify-between items-center py-lg border-b border-border mb-2xl">
      <div
        className="text-2xl font-bold tracking-normal text-gradient-hero cursor-pointer transition-opacity duration-base hover:opacity-80"
        onClick={() => router.push("/")}
      >
        PlaySwap
      </div>
      <div className="flex items-center gap-base px-xl py-[10px] glass-effect cursor-pointer transition-all duration-base rounded-lg hover:border-accent-green/40 hover:bg-white/[0.08]">
        <div
          className="w-9 h-9 bg-gradient-tertiary rounded-md flex items-center justify-center font-semibold text-sm text-white"
          style={{
            backgroundImage: user.photoCover ? `url(${user.photoCover})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {!user.photoCover && user.displayName?.[0]?.toUpperCase()}
        </div>
        <div className="text-sm text-text-primary font-medium">
          {user.displayName || "User"}
        </div>
      </div>
    </header>
  )
}
