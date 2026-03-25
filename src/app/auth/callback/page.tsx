"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showFallback, setShowFallback] = useState(false)

  useEffect(() => {
    const status = searchParams.get("status")
    const message = searchParams.get("message")

    if (status === "success") {
      localStorage.setItem("spotify_auth", String(Date.now()))
      window.close()
      setShowFallback(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    } else {
      const error = message || "auth_failed"
      router.push("/?error=" + encodeURIComponent(error))
    }
  }, [searchParams, router])

  if (!showFallback) return null

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary p-xl">
      <div className="max-w-md w-full text-center">
        <div className="mb-xl">
          <div className="w-20 h-20 mx-auto mb-lg rounded-full bg-gradient-primary flex items-center justify-center animate-pulse">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-text-primary mb-sm">Authentication Successful!</h2>
          <p className="text-base text-text-secondary mb-lg">
            Your Spotify account has been connected successfully.
          </p>

          <div className="glass-effect rounded-lg p-lg mb-lg">
            <p className="text-sm text-text-quaternary">
              This window will close automatically in a few seconds...
            </p>
          </div>
        </div>

        <button
          onClick={() => window.close()}
          className="text-sm text-accent-green hover:text-accent-green-light transition-colors duration-base cursor-pointer underline"
        >
          Click here to close manually
        </button>
      </div>
    </div>
  )
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-bg-primary">
          <div className="text-center">
            <div className="text-lg text-text-primary">Loading...</div>
          </div>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  )
}
