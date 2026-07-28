"use client";

import type { FontDefinition, FontSet } from "@/lib/fonts";
import { createContext, useContext } from "react";
import {
  fontDefinitions,
  getMonospaceFonts,
  getSansSerifFonts,
  getSerifFonts,
} from "@/lib/fonts";

const STORAGE_KEY = "blocks-preview-fonts";

export interface PreviewFontContextType {
  fontSet: FontSet;
  setFontSet: (fonts: Partial<FontSet>) => void;
  previewFont: { family: "sans" | "serif" | "mono"; fontName: string } | null;
  setPreviewFont: (font: { family: "sans" | "serif" | "mono"; fontName: string } | null) => void;
}

export const PreviewFontContext = createContext<PreviewFontContextType | null>(null);

const defaultContext: PreviewFontContextType = {
  fontSet: {
    sans: fontDefinitions.manrope,
    serif: fontDefinitions["plus-jakarta-sans"],
    mono: fontDefinitions["geist-mono"] || fontDefinitions.inter,
  },
  setFontSet: () => {},
  previewFont: null,
  setPreviewFont: () => {},
};

export function usePreviewFont() {
  const context = useContext(PreviewFontContext);
  return context ?? defaultContext;
}

export function getDefaultFontSet(): FontSet {
  return {
    sans: fontDefinitions.manrope,
    serif: fontDefinitions["plus-jakarta-sans"],
    mono: fontDefinitions["geist-mono"] || fontDefinitions.inter,
  };
}

export function loadStoredFonts(): FontSet {
  if (typeof window === "undefined") {
    return getDefaultFontSet();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        sans:
          fontDefinitions[parsed.sans as keyof typeof fontDefinitions] ||
          fontDefinitions.manrope,
        serif:
          fontDefinitions[parsed.serif as keyof typeof fontDefinitions] ||
          fontDefinitions["plus-jakarta-sans"],
        mono:
          fontDefinitions[parsed.mono as keyof typeof fontDefinitions] ||
          fontDefinitions["geist-mono"],
      };
    }
  } catch (error) {
    console.warn("Failed to load stored fonts:", error);
  }

  return getDefaultFontSet();
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
