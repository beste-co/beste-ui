"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface PreviewVariantsContextType {
  variants: Record<string, unknown>;
  setVariant: (propName: string, value: unknown) => void;
  clearVariants: () => void;
}

const PreviewVariantsContext = createContext<PreviewVariantsContextType | null>(
  null
);

interface PreviewVariantsProviderProps {
  children: ReactNode;
}

export function PreviewVariantsProvider({
  children,
}: PreviewVariantsProviderProps) {
  const [variants, setVariants] = useState<Record<string, unknown>>({});

  const setVariant = useCallback((propName: string, value: unknown) => {
    setVariants((prev) => ({
      ...prev,
      [propName]: value,
    }));
  }, []);

  const clearVariants = useCallback(() => {
    setVariants({});
  }, []);

  return (
    <PreviewVariantsContext.Provider
      value={{ variants, setVariant, clearVariants }}
    >
      {children}
    </PreviewVariantsContext.Provider>
  );
}

// Default no-op implementation for when used outside provider
const defaultContext: PreviewVariantsContextType = {
  variants: {},
  setVariant: () => {},
  clearVariants: () => {},
};

export function usePreviewVariants(): PreviewVariantsContextType {
  const context = useContext(PreviewVariantsContext);
  // Return default context if not within provider (e.g., homepage)
  return context ?? defaultContext;
}
