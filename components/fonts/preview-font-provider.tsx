"use client";

import type { FontDefinition, FontSet } from "@/lib/fonts";
import { fontDefinitions, generateAllCustomFontsCSS } from "@/lib/fonts";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PreviewFontContext, clearStoredFonts, getThemeFontSet, loadStoredFonts, saveFontsToStorage } from "@/lib/preview-font-store";
import { usePreviewTheme } from "@/lib/preview-theme-store";

const CUSTOM_FONTS_STYLE_ID = "preview-custom-fonts";

// Loads a font on demand: Google fonts by stylesheet, self-hosted ones by @font-face (declared once, fetched only when used)
export const loadGoogleFont = (font: FontDefinition) => {
  if (typeof document === "undefined") return;

  if (font.isCustomFont) {
    if (document.getElementById(CUSTOM_FONTS_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = CUSTOM_FONTS_STYLE_ID;
    style.textContent = generateAllCustomFontsCSS();
    document.head.appendChild(style);
    return;
  }

  if (!font.googleFontName) return;

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

export const loadFontSet = (fontSet: FontSet) => {
  loadGoogleFont(fontSet.sans);
  loadGoogleFont(fontSet.serif);
  loadGoogleFont(fontSet.mono);
};

interface PreviewFontProviderProps {
  children: React.ReactNode;
}

/**
 * Fonts follow the preview theme. A pick in the font selector is an explicit
 * override on top of it, and picking a theme drops that override so the new
 * theme arrives with its own type.
 */
export function PreviewFontProvider({ children }: PreviewFontProviderProps) {
  const { getResolvedTheme, pickVersion: themePickVersion } = usePreviewTheme();
  const [override, setOverride] = useState<FontSet | null>(null);
  const [previewFont, setPreviewFont] = useState<{
    family: "sans" | "serif" | "mono";
    fontName: string;
  } | null>(null);
  const [pickVersion, setPickVersion] = useState(0);

  const resolvedTheme = getResolvedTheme();
  const themeFontSet = useMemo(() => getThemeFontSet(resolvedTheme), [resolvedTheme]);
  const fontSet = override ?? themeFontSet;
  const fontSetRef = useRef(fontSet);
  fontSetRef.current = fontSet;

  // The stored pick only lands after mount, so the server and first client render agree on the theme's fonts
  useEffect(() => {
    setOverride(loadStoredFonts());
  }, []);

  const lastThemePick = useRef(themePickVersion);
  useEffect(() => {
    if (lastThemePick.current === themePickVersion) return;
    lastThemePick.current = themePickVersion;
    setOverride(null);
    clearStoredFonts();
  }, [themePickVersion]);

  useEffect(() => {
    loadFontSet(fontSet);
  }, [fontSet]);

  // Load preview font when hovering
  useEffect(() => {
    if (!previewFont) return;
    const fontDef = fontDefinitions[previewFont.fontName as keyof typeof fontDefinitions];
    if (fontDef) {
      loadGoogleFont(fontDef);
    }
  }, [previewFont]);

  // persist: false mirrors a set pushed from a parent frame without recording it as the reader's own pick
  const setFontSet = useCallback((fonts: Partial<FontSet>, options?: { persist?: boolean }) => {
    const persist = options?.persist ?? true;
    const base = fontSetRef.current;
    const next = {
      sans: fonts.sans || base.sans,
      serif: fonts.serif || base.serif,
      mono: fonts.mono || base.mono,
    };
    if (persist) {
      setPickVersion((version) => version + 1);
      saveFontsToStorage(next);
    }
    setOverride(next);
  }, []);

  const value = useMemo(
    () => ({
      fontSet,
      setFontSet,
      previewFont,
      setPreviewFont,
      pickVersion,
    }),
    [fontSet, setFontSet, previewFont, pickVersion]
  );

  // Children must render on the server: this provider wraps whole pages.
  return <PreviewFontContext.Provider value={value}>{children}</PreviewFontContext.Provider>;
}
