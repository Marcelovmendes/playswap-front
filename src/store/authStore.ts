import { create } from 'zustand'
import type { SpotifyUser } from '@/types/spotify'

interface AuthState {
  user: SpotifyUser | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: SpotifyUser | null) => void
  setIsLoading: (isLoading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),
  setIsLoading: (isLoading) => set({ isLoading }),
  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }),
}))
