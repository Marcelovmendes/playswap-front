"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const status = searchParams.get("status")
    const error = searchParams.get("error")
    const message = searchParams.get("message")

    if (window.opener) {
      const authMessage = {
        type: "SPOTIFY_AUTH_CALLBACK",
        status: status === "success" ? "success" : "error",
        error: error || message || (status === "success" ? null : "Authentication failed"),
      }

      const allowedOrigins = [
        process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
        "http://127.0.0.1:3000",
      ].filter(Boolean)

      allowedOrigins.forEach((origin) => {
        window.opener.postMessage(authMessage, origin)
      })

      setTimeout(() => {
        window.close()
      }, 3000)
    } else {
      if (status === "success") {
        router.push("/dashboard")
      } else {
        router.push("/?error=" + (error || message || "auth_failed"))
      }
    }
  }, [searchParams, router])

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
