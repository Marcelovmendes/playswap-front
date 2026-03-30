"use client"

import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

export default function AuthErrorPage({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-xl">
      <div className="w-full max-w-md bg-white/[0.02] border border-border backdrop-blur-[10px] rounded-2xl p-2xl text-center">
        <XCircle className="w-12 h-12 text-semantic-error mx-auto mb-lg" />
        <h1 className="text-xl font-semibold text-text-primary mb-sm">Something went wrong</h1>
        <p className="text-sm text-text-secondary mb-xl">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex flex-col gap-sm">
          <Button variant="primary" fullWidth onClick={reset}>
            Try Again
          </Button>
          <Link href="/dashboard" className="block w-full">
            <Button variant="secondary" fullWidth>
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
