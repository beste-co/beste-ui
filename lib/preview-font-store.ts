"use client";

import type { FontDefinition, FontName, FontSet } from "@/lib/fonts";
import type { Theme } from "@/lib/themes";
import { createContext, useContext } from "react";
import { usePreviewTheme } from "@/lib/preview-theme-store";
import {
  fontDefinitions as sharedFontDefinitions,
  getMonospaceFonts,
  getSansSerifFonts as getSharedSansSerifFonts,
  getSerifFonts,
} from "@/lib/fonts";

// Bumped when fonts started following the theme: a stored set is now an explicit override, so earlier picks start over
const STORAGE_KEY = "blocks-preview-fonts-v4";

/** The site's own typeface; it is loaded by globals.css and only exists in this app. */
export const BESTE_SANS = {
  name: "beste-sans",
  displayName: "Beste Sans",
  category: "sans-serif",
  weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
  italicWeights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
  isCustomFont: true,
  customFontPath: "/fonts/bestesans/web",
  fallback: "ui-sans-serif, system-ui, sans-serif",
  description: "The Beste typeface, drawn for interface and display type",
} as unknown as FontDefinition;

const fontDefinitions = { ...sharedFontDefinitions, "beste-sans": BESTE_SANS } as Record<FontName | "beste-sans", FontDefinition>;
const getSansSerifFonts = () => [BESTE_SANS, ...getSharedSansSerifFonts()];
const FIGTREE = fontDefinitions.figtree;

export interface PreviewFontContextType {
  fontSet: FontSet;
  setFontSet: (fonts: Partial<FontSet>, options?: { persist?: boolean }) => void;
  previewFont: { family: "sans" | "serif" | "mono"; fontName: string } | null;
  setPreviewFont: (font: { family: "sans" | "serif" | "mono"; fontName: string } | null) => void;
  /** Bumped on every pick the reader makes, never on the stored-set restore. */
  pickVersion: number;
}

export const PreviewFontContext = createContext<PreviewFontContextType | null>(null);

const defaultContext: PreviewFontContextType = {
  fontSet: {
    sans: FIGTREE,
    serif: FIGTREE,
    mono: fontDefinitions["geist-mono"] || fontDefinitions.inter,
  },
  setFontSet: () => {},
  previewFont: null,
  setPreviewFont: () => {},
  pickVersion: 0,
};

/** Without a font provider the preview simply wears the current theme's fonts. */
export function usePreviewFont() {
  const context = useContext(PreviewFontContext);
  const theme = usePreviewTheme().getResolvedTheme();
  return context ?? { ...defaultContext, fontSet: getThemeFontSet(theme) };
}

/** A theme names its fonts; resolve them against the catalogue, falling back to the site default. */
export function getThemeFontSet(theme: Theme | null | undefined): FontSet {
  const fallback = getDefaultFontSet();
  if (!theme?.fonts) return fallback;
  const resolve = (font: Theme["fonts"]["sans"] | undefined, base: FontDefinition) => {
    if (!font) return base;
    if (typeof font !== "string") return font;
    return (fontDefinitions as Record<string, FontDefinition>)[font] ?? base;
  };
  return {
    sans: resolve(theme.fonts.sans, fallback.sans),
    serif: resolve(theme.fonts.serif, fallback.serif),
    mono: resolve(theme.fonts.mono, fallback.mono),
  };
}

export function getDefaultFontSet(): FontSet {
  return {
    sans: FIGTREE,
    serif: FIGTREE,
    mono: fontDefinitions["geist-mono"] || fontDefinitions.inter,
  };
}

/** The reader's explicit font pick, or null to follow the theme. */
export function loadStoredFonts(): FontSet | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const fallback = getDefaultFontSet();
      return {
        sans: fontDefinitions[parsed.sans as keyof typeof fontDefinitions] || fallback.sans,
        serif: fontDefinitions[parsed.serif as keyof typeof fontDefinitions] || fallback.serif,
        mono: fontDefinitions[parsed.mono as keyof typeof fontDefinitions] || fallback.mono,
      };
    }
  } catch (error) {
    console.warn("Failed to load stored fonts:", error);
  }

  return null;
}

export function clearStoredFonts(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be blocked; nothing to clear then.
  }
}

export function saveFontsToStorage(fontSet: FontSet): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        sans: fontSet.sans.name,
        serif: fontSet.serif.name,
        mono: fontSet.mono.name,
      })
    );
  } catch (error) {
    console.warn("Failed to save fonts to storage:", error);
  }
}

/**
 * Generate font CSS variables for preview container
 */
export function generateFontCSSVariables(
  fontSet: FontSet,
  previewFont: { family: "sans" | "serif" | "mono"; fontName: string } | null
): React.CSSProperties {
  const getFontFamily = (font: FontDefinition) => {
    const fontName = font.isCustomFont ? font.displayName : font.googleFontName || font.displayName;
    return `"${fontName}", ${font.fallback}`;
  };

  let sans = fontSet.sans;
  let serif = fontSet.serif;
  let mono = fontSet.mono;

  // Apply preview font if set
  if (previewFont) {
    const previewFontDef = fontDefinitions[previewFont.fontName as keyof typeof fontDefinitions];
    if (previewFontDef) {
      switch (previewFont.family) {
        case "sans":
          sans = previewFontDef;
          break;
        case "serif":
          serif = previewFontDef;
          break;
        case "mono":
          mono = previewFontDef;
          break;
      }
    }
  }

  return {
    "--font-sans": getFontFamily(sans),
    "--font-serif": getFontFamily(serif),
    "--font-mono": getFontFamily(mono),
  } as React.CSSProperties;
}

// Re-export useful functions
export { fontDefinitions, getSansSerifFonts, getSerifFonts, getMonospaceFonts };
