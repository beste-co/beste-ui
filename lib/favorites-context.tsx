"use client";

import { type ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";

/**
 * Public-build favorites, kept in the browser.
 *
 * The private build stores these per account. Dropping the feature entirely
 * would mean a second version of every component that shows a star, so instead
 * it keeps working locally and simply does not follow you to another device.
 */

const STORAGE_KEY = "beste-ui:favorites";

interface FavoritesContextType {
  favorites: string[];
  loading: boolean;
  isFavorite: (blockName: string) => boolean;
  toggleFavorite: (blockName: string) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Read after mount so the server and client render the same empty list.
  useEffect(() => setFavorites(read()), []);

  const persist = useCallback((next: string[]) => {
    setFavorites(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // A full or blocked localStorage shouldn't take the page down with it.
    }
  }, []);

  const isFavorite = useCallback((name: string) => favorites.includes(name), [favorites]);

  const toggleFavorite = useCallback(
    async (name: string) => {
      persist(
        favorites.includes(name) ? favorites.filter((f) => f !== name) : [...favorites, name]
      );
    },
    [favorites, persist]
  );

  const refreshFavorites = useCallback(async () => setFavorites(read()), []);

  return (
    <FavoritesContext.Provider
      value={{ favorites, loading: false, isFavorite, toggleFavorite, refreshFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
