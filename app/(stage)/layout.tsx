import type { ReactNode } from "react";

import { CommandPalette } from "@/components/command-palette";
import { PreviewFontProvider } from "@/components/fonts/preview-font-provider";
import { PreviewThemeProvider } from "@/components/theme/preview-theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { CommandPaletteProvider } from "@/lib/command-palette-store";
import { PreviewVariantsProvider } from "@/lib/preview-variants-store";

/**
 * The providers the site runs on, without its header: a block or page detail
 * is the thing itself, edge to edge from the top of the viewport, and the
 * site's chrome would sit on top of the thing's own navbar. The footer comes
 * back under the details, where the stage puts it.
 *
 * A server layout, so a `notFound()` thrown by a page below still sets a real
 * 404 status instead of flushing a 200 shell first.
 */
export default function StageLayout({ children }: { children: ReactNode }) {
  return (
    <PreviewThemeProvider>
      <PreviewFontProvider>
        <PreviewVariantsProvider>
          <CommandPaletteProvider>
            {children}
            <CommandPalette />
            <Toaster position="bottom-right" />
          </CommandPaletteProvider>
        </PreviewVariantsProvider>
      </PreviewFontProvider>
    </PreviewThemeProvider>
  );
}
