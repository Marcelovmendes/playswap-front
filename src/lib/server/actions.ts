"use server"

import { cookies } from "next/headers"
import type { Playlist, Track, SavedTracksResponse } from "@/types/spotify"

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || "http://127.0.0.1:8080"

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
    const response = await fetch(`${GATEWAY_URL}/api/spotify/playlists`, {
      headers: {
        Cookie: cookieHeader,
      },
      credentials: "include",
      cache: "no-store",
    })

    if (!response.ok) {
      const body = await response.json().catch(() => null)
      const msg = body?.message || body?.code || `Request failed with status ${response.status}`
      throw new Error(msg)
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

export async function getPlaylistTracks(
  playlistId: string,
  offset: number = 0,
  limit: number = 50
): Promise<PlaylistTracksResponse> {
  const cookieHeader = await getCookieHeader()

  try {
    const response = await fetch(
      `${GATEWAY_URL}/api/spotify/playlists/${playlistId}/tracks?offset=${offset}&limit=${limit}`,
      {
        headers: {
          Cookie: cookieHeader,
        },
        credentials: "include",
        cache: "no-store",
      }
    )

    if (!response.ok) {
      const body = await response.json().catch(() => null)
      const msg = body?.message || body?.code || `Request failed with status ${response.status}`
      throw new Error(msg)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to fetch playlist tracks:", error)
    throw error
  }
}

type SavedTracksApiResponse = {
  items: { track: Track; addedAt: string }[]
  total: number
  limit: number
  offset: number
  next: string | null
}

type SavedTracksResult = {
  items: Track[]
  total: number
  limit: number
  offset: number
  hasNext: boolean
}

export async function getSavedTracks(
  offset: number = 0,
  limit: number = 50
): Promise<SavedTracksResult> {
  const cookieHeader = await getCookieHeader()

  try {
    const response = await fetch(
      `${GATEWAY_URL}/api/spotify/playlists/saved-tracks?offset=${offset}&limit=${limit}`,
      {
        headers: {
          Cookie: cookieHeader,
        },
        credentials: "include",
        cache: "no-store",
      }
    )

    if (!response.ok) {
      const body = await response.json().catch(() => null)
      const msg = body?.message || body?.code || `Request failed with status ${response.status}`
      throw new Error(msg)
    }

    const data: SavedTracksApiResponse = await response.json()
    return {
      items: data.items.map((item) => item.track),
      total: data.total,
      limit: data.limit,
      offset: data.offset,
      hasNext: data.next != null,
    }
  } catch (error) {
    console.error("Failed to fetch saved tracks:", error)
    throw error
  }
}
