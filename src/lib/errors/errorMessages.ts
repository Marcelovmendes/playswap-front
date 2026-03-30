import { AxiosError } from "axios"
import { toastEvents } from "@/lib/events/toastEvents"
import type { ConversionStatus } from "@/types/conversion"

export type AppError = {
  title: string
  message: string
  isRetryable: boolean
}

const SPOTIFY_ERROR_MAP: Record<string, AppError> = {
  AUTHENTICATION_EXCEPTION: {
    title: "Spotify Connection Lost",
    message: "Your Spotify session is no longer valid. Please reconnect your account.",
    isRetryable: false,
  },
  DOMAIN_EXCEPTION: {
    title: "Request Failed",
    message: "We couldn't process your request. Please check your input and try again.",
    isRetryable: false,
  },
  RESOURCE_NOT_FOUND_EXCEPTION: {
    title: "Not Found",
    message: "The playlist or track you're looking for doesn't exist or was removed from Spotify.",
    isRetryable: false,
  },
  SPOTIFY_API_EXCEPTION: {
    title: "Spotify Unavailable",
    message: "Spotify is having issues right now. Please try again in a few minutes.",
    isRetryable: true,
  },
  API_UNAVAILABLE_EXCEPTION: {
    title: "Spotify Unreachable",
    message: "We can't reach Spotify at the moment. Check your connection or try again shortly.",
    isRetryable: true,
  },
  SERVER_ERROR: {
    title: "Something Went Wrong",
    message: "An unexpected error occurred on our end. Please try again later.",
    isRetryable: true,
  },
}

const YOUTUBE_ERROR_MAP: Record<string, AppError> = {
  AUTHENTICATION_ERROR: {
    title: "YouTube Connection Lost",
    message: "Your YouTube session is no longer valid. Please reconnect your account.",
    isRetryable: false,
  },
  INVALID_STATE: {
    title: "Session Expired",
    message: "Your authentication session has expired. Please try connecting again.",
    isRetryable: false,
  },
  TOKEN_EXCHANGE_FAILED: {
    title: "Connection Failed",
    message: "We couldn't complete the YouTube sign-in. Please try again.",
    isRetryable: true,
  },
  INVALID_INPUT: {
    title: "Invalid Request",
    message: "Something was wrong with the data sent. Please try again.",
    isRetryable: false,
  },
  RESOURCE_NOT_FOUND: {
    title: "Not Found",
    message: "The requested YouTube resource doesn't exist or was removed.",
    isRetryable: false,
  },
  QUOTA_EXCEEDED: {
    title: "YouTube Limit Reached",
    message: "You've hit YouTube's daily usage limit. This resets at midnight Pacific time — please try again tomorrow.",
    isRetryable: false,
  },
  EXTERNAL_SERVICE_ERROR: {
    title: "YouTube Unavailable",
    message: "YouTube is having issues right now. Please try again in a few minutes.",
    isRetryable: true,
  },
}

const GENERIC_ERROR: AppError = {
  title: "Something Went Wrong",
  message: "An unexpected error occurred. Please try again later.",
  isRetryable: true,
}

export function parseApiError(error: unknown): AppError {
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data

    if (data.code && SPOTIFY_ERROR_MAP[data.code]) {
      return SPOTIFY_ERROR_MAP[data.code]
    }

    if (data.type && YOUTUBE_ERROR_MAP[data.type]) {
      return YOUTUBE_ERROR_MAP[data.type]
    }

    const status = error.response.status
    if (status === 429) {
      return {
        title: "Too Many Requests",
        message: "You're making requests too quickly. Please wait a moment and try again.",
        isRetryable: true,
      }
    }
    if (status >= 500) {
      return {
        title: "Server Error",
        message: "The server is having issues. Please try again in a few minutes.",
        isRetryable: true,
      }
    }
  }

  return GENERIC_ERROR
}

export function parseConversionError(
  errorMessage: string | null,
  status: ConversionStatus
): AppError {
  const error = (errorMessage ?? "").toLowerCase()

  if (error.includes("401") || error.includes("authentication")) {
    return {
      title: "Spotify Connection Lost",
      message: "We lost access to your Spotify account during conversion. Please reconnect and try again.",
      isRetryable: false,
    }
  }

  if (error.includes("quota")) {
    return {
      title: "YouTube Limit Reached",
      message: "YouTube's daily usage limit was exceeded during conversion. Please try again tomorrow.",
      isRetryable: false,
    }
  }

  if (status === "FETCHING") {
    return {
      title: "Failed to Load Tracks",
      message: "We couldn't fetch the tracks from your Spotify playlist. Please try again.",
      isRetryable: true,
    }
  }

  if (error.includes("no tracks matched")) {
    return {
      title: "No Matches Found",
      message: "We couldn't find any of your tracks on YouTube. The tracks may not be available on YouTube Music.",
      isRetryable: false,
    }
  }

  if (status === "MATCHING") {
    return {
      title: "Matching Failed",
      message: "Something went wrong while searching for your tracks on YouTube. Please try again.",
      isRetryable: true,
    }
  }

  if (status === "CREATING" && error.includes("create playlist")) {
    return {
      title: "Playlist Creation Failed",
      message: "We couldn't create the playlist on YouTube. Please try again.",
      isRetryable: true,
    }
  }

  if (status === "CREATING" && error.includes("add videos")) {
    return {
      title: "Failed to Add Tracks",
      message: "The playlist was created but we couldn't add all tracks. Please try again.",
      isRetryable: true,
    }
  }

  return {
    title: "Conversion Failed",
    message: "Something went wrong during conversion. Please try again.",
    isRetryable: true,
  }
}

export function showErrorToast(error: unknown): void {
  const appError = parseApiError(error)
  toastEvents.emit({ message: appError.message, variant: "error" })
}
