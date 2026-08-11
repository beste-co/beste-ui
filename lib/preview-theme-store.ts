"use client";

import type { Theme, ThemeName } from "@/lib/themes";
import { createContext, useContext } from "react";

import { THEME_NAME_COOKIE } from "@/lib/preview-theme-cookie";
import { themes } from "@/styles/themes";

// Both keys carry a version suffix. Changing the default theme does nothing for
// anyone who has already picked one — their stored value wins forever — so a new
// default only reaches returning visitors if the old key stops being read. Bump
// the suffix whenever a default change should override existing picks.
const STORAGE_KEY = "blocks-preview-theme-v2";
export { THEME_NAME_COOKIE };

const LEGACY_STORAGE_KEYS = ["blocks-preview-theme"];
const LEGACY_THEME_COOKIES = ["blocks-preview-theme-name"];

/**
 * Drop the pre-v2 pick so it cannot come back, and so the old year-long cookie
 * does not sit in the jar being sent on every request.
 */
export function clearLegacyPreviewTheme(): void {
  if (typeof window === "undefined") return;

  try {
    for (const key of LEGACY_STORAGE_KEYS) localStorage.removeItem(key);
    for (const name of LEGACY_THEME_COOKIES) {
      document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
    }
  } catch (error) {
    console.warn("Failed to clear legacy preview theme:", error);
  }
}

export const DEFAULT_LIGHT_PREVIEW_THEME: ThemeName = "default";
export const DEFAULT_DARK_PREVIEW_THEME: ThemeName = "claude-plus-dark";

export function getPreviewThemeForSiteMode(mode: string | undefined): ThemeName {
  return mode === "dark" ? DEFAULT_DARK_PREVIEW_THEME : DEFAULT_LIGHT_PREVIEW_THEME;
}

export interface PreviewThemeState {
  themeName: ThemeName;
  customTheme: Theme | null;
}

export interface PreviewThemeContextType {
  themeName: ThemeName;
  customTheme: Theme | null;
  previewTheme: Theme | null;
  setThemeName: (name: ThemeName) => void;
  setCustomTheme: (theme: Theme | null) => void;
  setPreviewTheme: (theme: Theme | null) => void;
  getResolvedTheme: () => Theme;
}

export const PreviewThemeContext = createContext<PreviewThemeContextType | null>(null);

const defaultContext: PreviewThemeContextType = {
  themeName: DEFAULT_LIGHT_PREVIEW_THEME,
  customTheme: null,
  previewTheme: null,
  setThemeName: () => {},
  setCustomTheme: () => {},
  setPreviewTheme: () => {},
  getResolvedTheme: () => themes[DEFAULT_LIGHT_PREVIEW_THEME] as Theme,
};

export function usePreviewTheme() {
  const context = useContext(PreviewThemeContext);
  return context ?? defaultContext;
}

export function resolveTheme(
  themeName: ThemeName,
  customTheme: Theme | null,
  previewTheme: Theme | null
): Theme {
  // Preview theme has highest priority (for hover effects)
  if (previewTheme) {
    return previewTheme;
  }

  // Custom theme if selected
  if (themeName === "custom" && customTheme) {
    return customTheme;
  }

  // Static theme from themes object
  const staticTheme = themes[themeName as keyof typeof themes];
  if (staticTheme) {
    return staticTheme as Theme;
  }

  // Fallback to default
  return themes.default as Theme;
}

export function loadStoredTheme(): PreviewThemeState & { hasStored: boolean } {
  if (typeof window === "undefined") {
    return {
      themeName: DEFAULT_LIGHT_PREVIEW_THEME,
      customTheme: null,
      hasStored: false,
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        themeName: parsed.themeName || DEFAULT_LIGHT_PREVIEW_THEME,
        customTheme: parsed.customTheme || null,
        hasStored: true,
      };
    }
  } catch (error) {
    console.warn("Failed to load stored theme:", error);
  }

  return {
    themeName: DEFAULT_LIGHT_PREVIEW_THEME,
    customTheme: null,
    hasStored: false,
  };
}

export function saveThemeToStorage(state: PreviewThemeState): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    // Mirror the theme NAME into a cookie so the server can render iframe embeds
    // with the right theme on first paint — otherwise fullscreen blocks flash
    // the default theme before the stored pick loads client-side.
    document.cookie = `${THEME_NAME_COOKIE}=${encodeURIComponent(
      state.themeName
    )}; path=/; max-age=31536000; samesite=lax`;
  } catch (error) {
    console.warn("Failed to save theme to storage:", error);
  }
}

/**
 * Generate inline CSS variables for a theme
 * Used for scoping theme to preview container only
 */
export function generateThemeCSSVariables(theme: Theme): React.CSSProperties {
  const tracking = typeof theme.trackingNormal === "number" ? theme.trackingNormal : 0;

  return {
    "--background": theme.colors.background,
    "--foreground": theme.colors.foreground,
    "--card": theme.colors.card,
    "--card-foreground": theme.colors.cardForeground,
    "--popover": theme.colors.popover,
    "--popover-foreground": theme.colors.popoverForeground,
    "--primary": theme.colors.primary,
    "--primary-foreground": theme.colors.primaryForeground,
    "--secondary": theme.colors.secondary,
    "--secondary-foreground": theme.colors.secondaryForeground,
    "--muted": theme.colors.muted,
    "--muted-foreground": theme.colors.mutedForeground,
    "--accent": theme.colors.accent,
    "--accent-foreground": theme.colors.accentForeground,
    "--destructive": theme.colors.destructive,
    "--destructive-foreground": theme.colors.destructiveForeground,
    "--border": theme.colors.border,
    "--input": theme.colors.input,
    "--ring": theme.colors.ring,
    "--chart-1": theme.colors.chart1,
    "--chart-2": theme.colors.chart2,
    "--chart-3": theme.colors.chart3,
    "--chart-4": theme.colors.chart4,
    "--chart-5": theme.colors.chart5,
    "--sidebar": theme.colors.sidebar,
    "--sidebar-foreground": theme.colors.sidebarForeground,
    "--sidebar-primary": theme.colors.sidebarPrimary,
    "--sidebar-primary-foreground": theme.colors.sidebarPrimaryForeground,
    "--sidebar-accent": theme.colors.sidebarAccent,
    "--sidebar-accent-foreground": theme.colors.sidebarAccentForeground,
    "--sidebar-border": theme.colors.sidebarBorder,
    "--sidebar-ring": theme.colors.sidebarRing,
    "--shadow-2xs": theme.shadows.shadow2xs,
    "--shadow-xs": theme.shadows.shadowXs,
    "--shadow-sm": theme.shadows.shadowSm,
    "--shadow": theme.shadows.shadow,
    "--shadow-md": theme.shadows.shadowMd,
    "--shadow-lg": theme.shadows.shadowLg,
    "--shadow-xl": theme.shadows.shadowXl,
    "--shadow-2xl": theme.shadows.shadow2xl,
    "--radius": theme.radius,
    "--tracking-normal": `${tracking}em`,
  } as React.CSSProperties;
}
