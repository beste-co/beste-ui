"use client";

import type { Theme } from "@/lib/themes";
import { themes } from "@/styles/themes";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";
import { useMemo, useRef } from "react";

import { ThemedPreview } from "@/components/theme/themed-preview";
import { PreviewFontContext, getThemeFontSet, usePreviewFont } from "@/lib/preview-font-store";
import { PreviewThemeContext, usePreviewTheme } from "@/lib/preview-theme-store";

interface PageThemeScopeProps {
  /** Name of the theme the page opens in. */
  theme: string;
  children: ReactNode;
}

/** The page's theme in the site's mode: `mira` turns into `mira-dark` when the site is dark, if that pair exists. */
function themeForMode(name: string, mode: string | undefined) {
  const base = name.replace(/-dark$/, "");
  const wanted = mode === "dark" ? `${base}-dark` : base;
  return (themes[wanted as keyof typeof themes] ?? themes[name as keyof typeof themes]) as Theme | undefined;
}

/**
 * Opens a page in its own theme and that theme's fonts, without touching the
 * reader's stored pick. The moment the reader picks a theme or a font (or
 * hovers one in the picker) the scope steps aside and the picker drives again.
 * Until then it follows the site's light or dark mode.
 */
export function PageThemeScope({ theme: themeName, children }: PageThemeScopeProps) {
  const outerTheme = usePreviewTheme();
  const outerFont = usePreviewFont();
  const { resolvedTheme } = useTheme();
  const pageTheme = useMemo(() => themeForMode(themeName, resolvedTheme), [themeName, resolvedTheme]);

  const initialPicks = useRef({ theme: outerTheme.pickVersion, font: outerFont.pickVersion });
  const pinned = Boolean(pageTheme) && outerTheme.pickVersion === initialPicks.current.theme && outerFont.pickVersion === initialPicks.current.font;

  const pageFonts = useMemo(() => (pageTheme ? getThemeFontSet(pageTheme) : null), [pageTheme]);

  const themeValue = useMemo(() => {
    if (!pinned || !pageTheme) return outerTheme;
    return { ...outerTheme, getResolvedTheme: () => outerTheme.previewTheme ?? pageTheme };
  }, [pinned, pageTheme, outerTheme]);

  const fontValue = useMemo(() => {
    // A theme hovered in the picker brings its own fonts through the outer context
    if (!pinned || !pageFonts || outerTheme.previewTheme) return outerFont;
    return { ...outerFont, fontSet: pageFonts };
  }, [pinned, pageFonts, outerFont, outerTheme.previewTheme]);

  return (
    <PreviewThemeContext.Provider value={themeValue}>
      <PreviewFontContext.Provider value={fontValue}>
        <ThemedPreview>{children}</ThemedPreview>
      </PreviewFontContext.Provider>
    </PreviewThemeContext.Provider>
  );
}
