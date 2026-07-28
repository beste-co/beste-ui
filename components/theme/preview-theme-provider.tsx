"use client";

import type { Theme, ThemeName } from "@/lib/themes";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_LIGHT_PREVIEW_THEME,
  PreviewThemeContext,
  getPreviewThemeForSiteMode,
  loadStoredTheme,
  resolveTheme,
  saveThemeToStorage,
} from "@/lib/preview-theme-store";

interface PreviewThemeProviderProps {
  children: React.ReactNode;
  /**
   * Saved theme NAME provided by the server (from a cookie). Lets the SSR of
   * iframe embeds paint the right theme immediately, so fullscreen blocks don't
   * flash the default theme before the stored pick loads. Falls back to the
   * light default when absent.
   */
  initialThemeName?: ThemeName;
}

export function PreviewThemeProvider({
  children,
  initialThemeName,
}: PreviewThemeProviderProps) {
  const { theme: siteTheme } = useTheme();
  const [themeName, setThemeNameState] = useState<ThemeName>(
    initialThemeName ?? DEFAULT_LIGHT_PREVIEW_THEME
  );
  const [customTheme, setCustomThemeState] = useState<Theme | null>(null);
  const [previewTheme, setPreviewTheme] = useState<Theme | null>(null);

  // A cookie-provided initial pick means the first site-mode resolve must not
  // overwrite it.
  const initializedRef = useRef(Boolean(initialThemeName));
  const prevSiteThemeRef = useRef<string | undefined>(undefined);

  // Reconcile with localStorage after mount (it carries custom themes the
  // cookie can't). When the cookie already matches the stored pick, this
  // setState is a no-op — React bails out — so there is NO flash; otherwise it
  // corrects to the stored value. SSR + first client render both use
  // initialThemeName, so hydration matches and the theme actually applies.
  useEffect(() => {
    const stored = loadStoredTheme();
    if (stored.hasStored) {
      setThemeNameState(stored.themeName);
      setCustomThemeState(stored.customTheme);
      initializedRef.current = true;
      // Backfill the cookie for visitors who picked a theme before the cookie
      // existed, so their next iframe embed renders flash-free server-side.
      saveThemeToStorage({
        themeName: stored.themeName,
        customTheme: stored.customTheme,
      });
    }
  }, []);

  // Site mode (light/dark) drives the preview theme default.
  // - First-time visitors (no saved pick) get the mode-appropriate default
  //   (claude-plus / perpetuity-dark).
  // - Only an actual mode toggle afterwards switches (and re-saves) the preview
  //   theme — so a saved pick is never clobbered on load.
  useEffect(() => {
    if (!siteTheme) return;

    if (prevSiteThemeRef.current === undefined) {
      prevSiteThemeRef.current = siteTheme;
      if (!initializedRef.current) {
        initializedRef.current = true;
        setThemeNameState(getPreviewThemeForSiteMode(siteTheme));
      }
      return;
    }

    if (prevSiteThemeRef.current === siteTheme) return;
    prevSiteThemeRef.current = siteTheme;
    const target = getPreviewThemeForSiteMode(siteTheme);
    setThemeNameState(target);
    saveThemeToStorage({ themeName: target, customTheme: null });
  }, [siteTheme]);

  const setThemeName = useCallback(
    (name: ThemeName) => {
      setThemeNameState(name);
      saveThemeToStorage({ themeName: name, customTheme });
    },
    [customTheme]
  );

  const setCustomTheme = useCallback(
    (theme: Theme | null) => {
      setCustomThemeState(theme);
      const newThemeName = theme
        ? "custom"
        : themeName === "custom"
          ? DEFAULT_LIGHT_PREVIEW_THEME
          : themeName;
      if (theme) {
        setThemeNameState("custom");
      }
      saveThemeToStorage({ themeName: newThemeName, customTheme: theme });
    },
    [themeName]
  );

  const getResolvedTheme = useCallback(() => {
    return resolveTheme(themeName, customTheme, previewTheme);
  }, [themeName, customTheme, previewTheme]);

  const value = useMemo(
    () => ({
      themeName,
      customTheme,
      previewTheme,
      setThemeName,
      setCustomTheme,
      setPreviewTheme,
      getResolvedTheme,
    }),
    [themeName, customTheme, previewTheme, setThemeName, setCustomTheme, getResolvedTheme]
  );

  return (
    <PreviewThemeContext.Provider value={value}>
      {children}
    </PreviewThemeContext.Provider>
  );
}
