"use client";

import type { FontDefinition, FontSet } from "@/lib/fonts";
import { fontDefinitions } from "@/lib/fonts";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  PreviewFontContext,
  getDefaultFontSet,
  loadStoredFonts,
  saveFontsToStorage,
} from "@/lib/preview-font-store";

// Function to load Google Fonts dynamically
const loadGoogleFont = (font: FontDefinition) => {
  if (typeof document === "undefined") return;
  if (!font.googleFontName) return;
  if (font.isCustomFont) return;

  // Skip system fonts
  const systemFonts = ["system-ui", "ui-sans-serif", "ui-serif", "ui-monospace"];
  if (systemFonts.includes(font.googleFontName)) return;

  const fontName = font.googleFontName.replace(/ /g, "+").replace(/'/g, "");
  const link = document.createElement("link");
  link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;500;600;700&display=block`;
  link.rel = "stylesheet";

  // Check if font is already loaded
  const existingLink = document.querySelector(`link[href*="${fontName}"]`);
  if (!existingLink) {
    document.head.appendChild(link);
  }
};

interface PreviewFontProviderProps {
  children: React.ReactNode;
}

export function PreviewFontProvider({ children }: PreviewFontProviderProps) {
  const [fontSet, setFontSetState] = useState<FontSet>(getDefaultFontSet);
  const [previewFont, setPreviewFont] = useState<{
    family: "sans" | "serif" | "mono";
    fontName: string;
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadStoredFonts();
    setFontSetState(stored);
    setMounted(true);
  }, []);

  // Load Google Fonts when fontSet changes
  useEffect(() => {
    if (!mounted) return;
    loadGoogleFont(fontSet.sans);
    loadGoogleFont(fontSet.serif);
    loadGoogleFont(fontSet.mono);
  }, [fontSet, mounted]);

  // Load preview font when hovering
  useEffect(() => {
    if (!previewFont) return;
    const fontDef = fontDefinitions[previewFont.fontName as keyof typeof fontDefinitions];
    if (fontDef) {
      loadGoogleFont(fontDef);
    }
  }, [previewFont]);

  const setFontSet = useCallback((fonts: Partial<FontSet>) => {
    setFontSetState((prev) => {
      const next = {
        sans: fonts.sans || prev.sans,
        serif: fonts.serif || prev.serif,
        mono: fonts.mono || prev.mono,
      };
      saveFontsToStorage(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      fontSet,
      setFontSet,
      previewFont,
      setPreviewFont,
    }),
    [fontSet, setFontSet, previewFont]
  );

  // Children must render on the server: this provider wraps whole pages, and
  // gating it on `mounted` would strip them from the SSR HTML. Hydration is
  // safe because the first client render uses getDefaultFontSet() too — the
  // stored fonts only land in the mount effect below.
  return (
    <PreviewFontContext.Provider value={value}>{children}</PreviewFontContext.Provider>
  );
}
