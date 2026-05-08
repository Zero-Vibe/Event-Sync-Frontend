import { useCallback, useEffect, useState } from "react";

const KEY = "eventsync-favorites";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

const listeners = new Set<(v: string[]) => void>();

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(read());
    const cb = (v: string[]) => setFavorites(v);
    listeners.add(cb);
    return () => { listeners.delete(cb); };
  }, []);

  const toggle = useCallback((id: string) => {
    const cur = read();
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    if (typeof window !== "undefined") {
      localStorage.setItem(KEY, JSON.stringify(next));
    }
    listeners.forEach((l) => l(next));
  }, []);

  const has = useCallback((id: string) => favorites.includes(id), [favorites]);

  return { favorites, toggle, has };
}