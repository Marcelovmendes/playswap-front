"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Youtube } from "lucide-react"

function YouTubeCallbackContent() {
  const searchParams = useSearchParams()
  const [showError, setShowError] = useState<string | null>(null)

  useEffect(() => {
    const status = searchParams.get("status")
    const message = searchParams.get("message")

    if (status === "success") {
      localStorage.setItem("youtube_auth", String(Date.now()))
      window.close()
    } else {
      setShowError(message || "Authentication failed")
    }
  }, [searchParams])

  if (showError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary p-xl">
        <div className="max-w-md w-full text-center">
          <div className="mb-xl">
            <div className="w-20 h-20 mx-auto mb-lg rounded-full bg-[linear-gradient(135deg,#FF0000_0%,#cc0000_100%)] flex items-center justify-center">
              <Youtube className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-sm">Connection Failed</h2>
            <p className="text-base text-text-secondary mb-lg">{showError}</p>
          </div>
          <button
            onClick={() => window.close()}
            className="text-sm text-[#FF0000] hover:text-[#cc0000] transition-colors duration-base cursor-pointer underline"
          >
            Close this window
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary p-xl">
      <div className="max-w-md w-full text-center">
        <div className="mb-xl">
          <div className="w-20 h-20 mx-auto mb-lg rounded-full bg-[linear-gradient(135deg,#FF0000_0%,#cc0000_100%)] flex items-center justify-center animate-pulse">
            <Youtube className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-text-primary mb-sm">YouTube Connected!</h2>
          <p className="text-base text-text-secondary mb-lg">
            Your YouTube account has been connected successfully.
          </p>

          <div className="glass-effect rounded-lg p-lg mb-lg">
            <p className="text-sm text-text-quaternary">
              This window will close automatically...
            </p>
          </div>
        </div>

        <button
          onClick={() => window.close()}
          className="text-sm text-[#FF0000] hover:text-[#cc0000] transition-colors duration-base cursor-pointer underline"
        >
          Click here to close manually
        </button>
      </div>
    </div>
  )
}

export default function YouTubeCallbackPage() {
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
      <YouTubeCallbackContent />
    </Suspense>
  )
}
