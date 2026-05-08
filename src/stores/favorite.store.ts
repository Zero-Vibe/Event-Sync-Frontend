import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  sessionIds: string[];
  toggle: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      sessionIds: [],
      toggle: (id) =>
        set((s) => ({
          sessionIds: s.sessionIds.includes(id)
            ? s.sessionIds.filter((x) => x !== id)
            : [...s.sessionIds, id],
        })),
      isFavorite: (id) => get().sessionIds.includes(id),
    }),
    { name: 'favorites-storage' } 
  )
);