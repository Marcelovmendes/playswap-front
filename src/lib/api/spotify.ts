import axios from "axios"
import { apiClient } from "./client"
import type {
  SpotifyPlaylist,
  SpotifyPlaylistResponse,
  UserProfile,
  Playlist,
} from "@/types/spotify"
import type {
  CreateConversionRequest,
  CreateConversionResponse,
  ConversionStatusResponse,
} from "@/types/conversion"

const SPOTIFY_SERVICE_URL = process.env.NEXT_PUBLIC_SPOTIFY_SERVICE_URL || "http://127.0.0.1:8080"

const spotifyAuthClient = axios.create({
  baseURL: SPOTIFY_SERVICE_URL,
  withCredentials: true,
})

export const spotifyApi = {
  auth: {
    initiateLogin: async (): Promise<Window | null> => {
      const width = 500
      const height = 700
      const left = window.screenX + (window.outerWidth - width) / 2
      const top = window.screenY + (window.outerHeight - height) / 2
      const popup = window.open("about:blank", "_blank", `width=${width},height=${height},left=${left},top=${top}`)

      const response = await spotifyAuthClient.get<string>("/auth/", {
        headers: {
          "Content-Type": "text/plain",
        },
      })
      const spotifyAuthUrl = response.data

      if (popup) {
        popup.location.href = spotifyAuthUrl
      }
      return popup
    },
    pollAuthStatus: async (): Promise<boolean> => {
      const gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL || "http://127.0.0.1:8080"
      try {
        const response = await fetch(`${gatewayUrl}/api/spotify/users/details`, {
          credentials: "include",
        })
        return response.ok
      } catch {
        return false
      }
    },
    linkYoutube: async (youtubeSessionId: string) => {
      await apiClient.post("/api/auth/spotify/link-youtube", { youtubeSessionId })
    },
  },

  user: {
    getDetails: async () => {
      const response = await apiClient.get<UserProfile>("/api/spotify/users/details")
      return response.data
    },
  },

  playlists: {
    getUserPlaylists: async () => {
      const response = await apiClient.get<Playlist[]>("/api/spotify/playlists")
      return response.data
    },
    getAll: async () => {
      const response = await apiClient.get<SpotifyPlaylist[]>("/api/spotify/playlists")
      return response.data
    },

    getTracks: async (playlistId: string) => {
      const response = await apiClient.get<SpotifyPlaylistResponse>(
        `/api/spotify/playlists/${playlistId}/tracks`
      )
      return response.data
    },
  },

  conversions: {
    create: async (request: CreateConversionRequest) => {
      const response = await apiClient.post<CreateConversionResponse>(
        "/api/conversions",
        request
      )
      return response.data
    },

    getStatus: async (jobId: string) => {
      const response = await apiClient.get<ConversionStatusResponse>(
        `/api/conversions/${jobId}/status`
      )
      return response.data
    },
  },
}
