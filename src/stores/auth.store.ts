import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
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
      setToken: (token) => {
        syncToken(token);
        set({ token });
      },
      logout: () => {
        syncToken(null);
        set({ token: null });
      },
    }),
    { name: 'auth-storage' }
  )
);