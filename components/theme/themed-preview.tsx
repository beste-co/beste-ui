"use client";

import { useId, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  generateThemeCSSVariables,
  usePreviewTheme,
} from "@/lib/preview-theme-store";
import {
  generateFontCSSVariables,
  usePreviewFont,
} from "@/lib/preview-font-store";

interface ThemedPreviewProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * ThemedPreview container that applies selected theme and font CSS variables
 * Only children within this container will be affected by the preview theme/fonts
 */
export function ThemedPreview({ children, className }: ThemedPreviewProps) {
  const { getResolvedTheme } = usePreviewTheme();
  const { fontSet, previewFont } = usePreviewFont();
  const theme = getResolvedTheme();
  const uniqueId = useId();
  const containerId = `themed-preview-${uniqueId.replace(/:/g, "")}`;

  const themeCSSVariables = useMemo(() => {
    return generateThemeCSSVariables(theme);
  }, [theme]);

  const fontCSSVariables = useMemo(() => {
    return generateFontCSSVariables(fontSet, previewFont);
  }, [fontSet, previewFont]);

  const isDark = theme.category === "dark";

  // Scoped styles for fonts and shadows
  const scopedStyles = `
    #${containerId} h1,
    #${containerId} h2,
    #${containerId} h3,
    #${containerId} h4,
    #${containerId} h5,
    #${containerId} h6 {
      font-family: var(--font-serif);
    }
    #${containerId} code,
    #${containerId} pre,
    #${containerId} kbd,
    #${containerId} samp {
      font-family: var(--font-mono);
    }
    #${containerId} .shadow-2xs { box-shadow: var(--shadow-2xs) !important; }
    #${containerId} .shadow-xs { box-shadow: var(--shadow-xs) !important; }
    #${containerId} .shadow-sm { box-shadow: var(--shadow-sm) !important; }
    #${containerId} .shadow { box-shadow: var(--shadow) !important; }
    #${containerId} .shadow-md { box-shadow: var(--shadow-md) !important; }
    #${containerId} .shadow-lg { box-shadow: var(--shadow-lg) !important; }
    #${containerId} .shadow-xl { box-shadow: var(--shadow-xl) !important; }
    #${containerId} .shadow-2xl { box-shadow: var(--shadow-2xl) !important; }
    #${containerId} .rounded { border-radius: var(--radius) !important; }
    #${containerId} .rounded-md { border-radius: calc(var(--radius) - 2px) !important; }
    #${containerId} .rounded-lg { border-radius: var(--radius) !important; }
    #${containerId} .rounded-xl { border-radius: calc(var(--radius) + 4px) !important; }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: scopedStyles }} />
      <div
        id={containerId}
        className={cn(
          "themed-preview w-full min-h-full transition-colors duration-300",
          isDark && "dark",
          className
        )}
        style={{
          ...themeCSSVariables,
          ...fontCSSVariables,
          backgroundColor: `var(--background)`,
          color: `var(--foreground)`,
          fontFamily: `var(--font-sans)`,
        }}
      >
        {children}
      </div>
    </>
  );
}
