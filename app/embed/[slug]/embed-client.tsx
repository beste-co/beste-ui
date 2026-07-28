"use client";

import type { Theme, ThemeName } from "@/lib/themes";
import type { FontSet } from "@/lib/fonts";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { ThemedPreview } from "@/components/theme/themed-preview";
import { PreviewThemeProvider } from "@/components/theme/preview-theme-provider";
import { PreviewFontProvider } from "@/components/fonts/preview-font-provider";
import { usePreviewTheme } from "@/lib/preview-theme-store";
import { usePreviewFont } from "@/lib/preview-font-store";
import {
  PreviewVariantsProvider,
  usePreviewVariants,
} from "@/lib/preview-variants-store";

interface EmbedClientProps {
  children: ReactNode;
  /** Saved theme name from the server cookie, for flash-free SSR theming. */
  initialThemeName?: string;
}

interface EmbedMessage {
  type: "THEME_UPDATE" | "FONT_UPDATE" | "VARIANT_UPDATE";
  theme?: Theme;
  fontSet?: FontSet;
  variants?: Record<string, unknown>;
}

function EmbedClientInner({ children }: EmbedClientProps) {
  const { setPreviewTheme } = usePreviewTheme();
  const { setFontSet } = usePreviewFont();
  const { setVariant, clearVariants } = usePreviewVariants();
  // ?fit=1 (blog embeds): drop min-h-screen so content takes its natural
  // height, and report that height to the parent so the iframe can auto-size.
  // Read via effect (not useSearchParams) to avoid a Suspense requirement.
  const [fitContent, setFitContent] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFitContent(params.get("fit") === "1");
  }, []);

  // Report content height to the parent frame while in fit mode
  useEffect(() => {
    if (!fitContent || window.parent === window) return;

    document.documentElement.style.overflow = "hidden";

    const postSize = () => {
      window.parent.postMessage(
        { type: "EMBED_SIZE", height: document.body.scrollHeight },
        "*"
      );
    };

    const observer = new ResizeObserver(postSize);
    observer.observe(document.body);
    postSize();

    return () => {
      observer.disconnect();
      document.documentElement.style.overflow = "";
    };
  }, [fitContent]);

  // Listen for postMessage from parent
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only the page that framed this one gets to drive it. Without this any
      // site could embed a preview and then push it arbitrary theme, font and
      // variant values through postMessage.
      if (event.origin !== window.location.origin) return;

      const data = event.data as EmbedMessage;

      if (data.type === "THEME_UPDATE" && data.theme) {
        setPreviewTheme(data.theme);
      }

      if (data.type === "FONT_UPDATE" && data.fontSet) {
        setFontSet(data.fontSet);
      }

      if (data.type === "VARIANT_UPDATE" && data.variants) {
        clearVariants();
        for (const [key, value] of Object.entries(data.variants)) {
          setVariant(key, value);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [setPreviewTheme, setFontSet, setVariant, clearVariants]);

  // Always use ThemedPreview - it will load theme from localStorage or use postMessage updates
  // min-h-screen ensures the content fills the phone screen in mobile view
  // (skipped in fit mode, where the iframe adopts the content's height instead)
  return (
    <ThemedPreview className={fitContent ? undefined : "min-h-screen"}>
      {children}
    </ThemedPreview>
  );
}

export function EmbedClient({ children, initialThemeName }: EmbedClientProps) {
  return (
    <PreviewThemeProvider
      initialThemeName={initialThemeName as ThemeName | undefined}
    >
      <PreviewFontProvider>
        <PreviewVariantsProvider>
          <EmbedClientInner>{children}</EmbedClientInner>
        </PreviewVariantsProvider>
      </PreviewFontProvider>
    </PreviewThemeProvider>
  );
}
