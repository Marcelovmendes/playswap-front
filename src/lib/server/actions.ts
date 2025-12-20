"use server"

import { cookies } from "next/headers"
import type { Playlist, Track } from "@/types/spotify"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080"

async function getCookieHeader() {
  const cookieStore = cookies()
  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ")
}

export async function getPlaylists(): Promise<Playlist[]> {
  const cookieHeader = await getCookieHeader()

  try {
    const response = await fetch(`${API_URL}/api/spotify/v1/playlist/`, {
      headers: {
        Cookie: cookieHeader,
      },
      credentials: "include",
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch playlists")
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to fetch playlists:", error)
    throw error
  }
}

type PlaylistTracksResponse = {
  items: Track[]
  total: number
  limit: number
  offset: number
  hasNext: boolean
}

export async function getPlaylistTracks( playlistId: string, offset: number = 0, limit: number = 50 ): Promise<PlaylistTracksResponse> {

  const cookieHeader = await getCookieHeader()

  try {
    const response = await fetch(
      `${API_URL}/api/spotify/v1/playlist/${playlistId}/tracks?offset=${offset}&limit=${limit}`,
      {
        headers: {
          Cookie: cookieHeader,
        },
        credentials: "include",
        cache: "no-store",
      }
    )

    if (!response.ok) {
      throw new Error("Failed to fetch playlist tracks")
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to fetch playlist tracks:", error)
    throw error
  }
}
