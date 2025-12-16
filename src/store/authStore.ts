import { create } from "zustand";
import type { UserProfile } from "@/types/spotify";
import { spotifyApi } from "@/lib/api/spotify";
import { apiClient } from "@/lib/api/client";

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: UserProfile | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const user = await spotifyApi.user.getDetails();
      set({
        isAuthenticated: true,
        user,
        isLoading: false,
      });
    } catch (error) {
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    }
  },

  logout: async () => {
    try {
      await apiClient.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      set({
        isAuthenticated: false,
        user: null,
      });
    }
  },

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),
}));
