"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ThemedPreview } from "@/components/theme/themed-preview";
import { Spinner } from "@/components/ui/spinner";
import { getBlock } from "@/lib/blocks";
import { getBlockObfuscated } from "@/lib/blocks-obfuscated";
import { usePreviewFont } from "@/lib/preview-font-store";
import { usePreviewTheme } from "@/lib/preview-theme-store";
import { usePreviewVariants } from "@/lib/preview-variants-store";

interface BlockStageViewProps {
  name: string;
  /** App-style blocks that need a viewport of their own render in a frame. */
  fullscreen?: boolean;
  isUserPro?: boolean;
}

function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.split(".");
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    if (current[key!] && typeof current[key!] === "object") {
      current[key!] = { ...(current[key!] as Record<string, unknown>) };
    } else {
      current[key!] = {};
    }
    current = current[key!] as Record<string, unknown>;
  }
  current[parts[parts.length - 1]!] = value;
}

function mergeVariants(
  base: Record<string, unknown>,
  variants: Record<string, unknown>
): Record<string, unknown> {
  const result = { ...base };
  for (const [key, value] of Object.entries(variants)) {
    if (key.includes(".")) {
      setNestedValue(result, key, value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

/**
 * The block on the stage. Most render inline, server and client alike, with
 * the demo props under whatever variants the reader has picked. Fullscreen
 * blocks get a viewport-tall frame instead, and the theme and font chosen on
 * this page are pushed into it over postMessage, since a frame is its own
 * React tree.
 */
export function BlockStageView({ name, fullscreen = false, isUserPro = false }: BlockStageViewProps) {
  const { variants } = usePreviewVariants();
  const { getResolvedTheme } = usePreviewTheme();
  const { fontSet } = usePreviewFont();
  const resolvedTheme = getResolvedTheme();

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [frameLoaded, setFrameLoaded] = useState(false);

  const syncPreviewToFrame = useCallback(() => {
    const frame = iframeRef.current?.contentWindow;
    if (!frame) return;
    frame.postMessage({ type: "THEME_UPDATE", theme: resolvedTheme }, "*");
    frame.postMessage({ type: "FONT_UPDATE", fontSet }, "*");
  }, [resolvedTheme, fontSet]);

  useEffect(() => {
    syncPreviewToFrame();
  }, [syncPreviewToFrame]);

  const syncRef = useRef(syncPreviewToFrame);
  useEffect(() => {
    syncRef.current = syncPreviewToFrame;
  }, [syncPreviewToFrame]);

  // The load may already have happened before this attaches (a cached frame
  // finishing before hydration), so it is checked once as well as listened for.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-attach per frame
  useEffect(() => {
    setFrameLoaded(false);
    const frame = iframeRef.current;
    if (!frame) return;
    const markLoaded = () => {
      syncRef.current();
      setFrameLoaded(true);
    };
    try {
      if (
        frame.contentWindow &&
        frame.contentWindow.location.href !== "about:blank" &&
        frame.contentDocument?.readyState === "complete"
      ) {
        markLoaded();
      }
    } catch {
      // Same-origin embed shouldn't throw; if it does, wait for the load event.
    }
    frame.addEventListener("load", markLoaded);
    return () => frame.removeEventListener("load", markLoaded);
  }, [name, fullscreen]);

  if (fullscreen) {
    return (
      <div className="relative h-svh w-full bg-muted/30">
        {!frameLoaded && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-muted/30">
            <Spinner className="size-6 text-muted-foreground" />
          </div>
        )}
        <iframe
          ref={iframeRef}
          key={name}
          src={`/embed/${name}`}
          title={`${name} preview`}
          className="h-full w-full border-0"
        />
      </div>
    );
  }

  const useLiveBlock = isUserPro || process.env.NODE_ENV === "development";
  const block = useLiveBlock ? getBlock(name) : getBlockObfuscated(name);
  const Component = block?.component;
  const mergedProps = block
    ? mergeVariants(block.demoProps as Record<string, unknown>, variants)
    : null;

  // At least a viewport tall, the block at the top and the theme's ground
  // filling the rest: a short block still reads as a page of its own, and the
  // rule to the details only appears once the reader scrolls for it.
  return (
    <ThemedPreview className="min-h-svh">
      {Component && mergedProps ? (
        <Component {...mergedProps} />
      ) : (
        <div className="flex min-h-[60vh] items-center justify-center p-12 text-base text-muted-foreground">
          Block not found.
        </div>
      )}
    </ThemedPreview>
  );
}
