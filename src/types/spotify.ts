export type SpotifyUser = {
  id: string
  display_name: string
  email: string
  images: SpotifyImage[]
  country: string
  product: string
}

export type SpotifyImage = {
  url: string
  height: number | null
  width: number | null
}

export type SpotifyPlaylist = {
  id: string
  name: string
  description: string
  images: SpotifyImage[]
  owner: {
    display_name: string
    id: string
  }
  tracks: {
    total: number
  }
  public: boolean
  collaborative: boolean
}

export type SpotifyTrack = {
  id: string
  name: string
  artists: SpotifyArtist[]
  album: SpotifyAlbum
  duration_ms: number
  explicit: boolean
  preview_url: string | null
  uri: string
}

export type SpotifyArtist = {
  id: string
  name: string
  uri: string
}

export type SpotifyAlbum = {
  id: string
  name: string
  images: SpotifyImage[]
  release_date: string
  uri: string
}

export type SpotifyPlaylistTrack = {
  added_at: string
  track: SpotifyTrack
}

export type SpotifyPlaylistResponse = {
  items: SpotifyPlaylistTrack[]
  total: number
  limit: number
  offset: number
  next: string | null
  previous: string | null
}

export interface UserProfile {
  id: string
  displayName: string
  email: string
  country: string
  photoCover: string | null
  externalUrls: string
  followersCount: number
  type: string
}

export interface Playlist {
  id: string
  name: string
  description: string | null
  trackCount: number
  imageUrl: string | null
  ownerId: string
  ownerName: string
  publicAccess: boolean
  collaborative: boolean
  externalUrl: string
}
