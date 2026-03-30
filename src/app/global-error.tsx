"use client"

import { XCircle } from "lucide-react"

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body className="min-h-screen bg-bg-primary flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white/[0.02] border border-white/10 backdrop-blur-[10px] rounded-2xl p-8 text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-white mb-2">Something went wrong</h1>
          <p className="text-sm text-gray-400 mb-6">
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm font-medium hover:bg-white/20 transition-colors"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  )
}
