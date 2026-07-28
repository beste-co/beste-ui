"use client";

import { type ReactNode, createContext, useContext } from "react";
import { CommandPalette } from "@/components/command-palette";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PreviewThemeProvider } from "@/components/theme/preview-theme-provider";
import { CommandPaletteProvider } from "@/lib/command-palette-store";
import { PreviewVariantsProvider } from "@/lib/preview-variants-store";

/**
 * True once the chrome is on the page, so a second MainProviders inside the
 * first knows to stay out of the way.
 */
const InsideChrome = createContext(false);

/**
 * Header, footer and the providers the site runs on.
 *
 * It is deliberately safe to nest. The 404 page needs the chrome when nothing
 * below the root layout has rendered — an address that matched no route at all
 * — but a `notFound()` thrown from inside the site arrives with the layout,
 * and its chrome, already around it. Rendering a second header there is what
 * put two of them on the page; a boundary per segment fixed that but stopped
 * the 404 UI from rendering at all, so the component handles it instead.
 */
export function MainProviders({ children }: { children: ReactNode }) {
  const alreadyWrapped = useContext(InsideChrome);

  if (alreadyWrapped) {
    return <>{children}</>;
  }

  return (
    <InsideChrome.Provider value={true}>
      <PreviewThemeProvider>
        <PreviewVariantsProvider>
          <CommandPaletteProvider>
            <SiteHeader />
            {children}
            <SiteFooter />
            <CommandPalette />
          </CommandPaletteProvider>
        </PreviewVariantsProvider>
      </PreviewThemeProvider>
    </InsideChrome.Provider>
  );
}
