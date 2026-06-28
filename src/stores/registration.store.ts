import { create } from "zustand";
import { persist } from "zustand/middleware";

interface sessionRegistrationsState {
    sessionIds: string[];
    toggle: (id: string) => void;
    isRegistered: (id: string) => boolean;
}

export const useRegistrationStore = create<sessionRegistrationsState>()(
  persist(
    (set, get) => ({
      sessionIds: [],
      toggle: (id) =>
        set((s) => ({
          sessionIds: s.sessionIds.includes(id)
            ? s.sessionIds.filter((x) => x !== id)
            : [...s.sessionIds, id],
        })),
      isRegistered: (id) => get().sessionIds.includes(id),
    }),
    { name: 'registration-storage' } 
  )
);
