"use client";

import { useState, useCallback, type ReactNode } from "react";
import { SearchContext } from "@/lib/search-store";

interface SearchProviderProps {
  children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const clearSearch = useCallback(() => {
    setQuery("");
    setIsSearching(false);
  }, []);

  return (
    <SearchContext.Provider
      value={{
        query,
        isSearching,
        setQuery,
        setIsSearching,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
