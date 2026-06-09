import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

function syncToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('access_token', token);
  } else {
    localStorage.removeItem('access_token');
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      setToken: (token) => {
        syncToken(token);
        set({ token, isAuthenticated: true });
      },
      logout: () => {
        syncToken(null);
        set({ token: null, isAuthenticated: false });
      },
    }),
    { name: 'auth-storage' }
  )
);
