import { apiClient } from './client'
import type { SpotifyUser, SpotifyPlaylist, SpotifyPlaylistResponse, UserProfile, Playlist } from '@/types/spotify'

export const spotifyApi = {
  auth: {
    initiateLogin: async () => {
      const response = await apiClient.get<string>('/api/auth/', {
        headers: {
          'Content-Type': 'text/plain',
        },
      })
      const spotifyAuthUrl = response.data
      console.log('Redirecting to Spotify Auth URL:', spotifyAuthUrl)
      window.open(spotifyAuthUrl, '_blank', 'width=600,height=800')
    },
  },

  user: {
    getDetails: async () => {
      const response = await apiClient.get<UserProfile>('/api/spotify/v1/users/details')
      return response.data
    },
  },

  playlists: {
    getUserPlaylists: async () => {
      const response = await apiClient.get<Playlist[]>('/api/spotify/v1/playlist/')
      return response.data
    },
    getAll: async () => {
      const response = await apiClient.get<SpotifyPlaylist[]>('/api/spotify/v1/playlist/')
      return response.data
    },

    getTracks: async (playlistId: string) => {
      const response = await apiClient.get<SpotifyPlaylistResponse>(
        `/api/spotify/v1/playlist/${playlistId}/tracks`
      )
      return response.data
    },
  },
}
