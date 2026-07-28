"use client";

import { useEffect, useRef, useState } from "react";

interface LiveFrameProps {
  src: string;
  title: string;
  /** Placeholder height until the embed reports its measured height */
  initialHeight: number;
}

/**
 * Auto-sizing iframe for blog embeds. The embed page (loaded with ?fit=1)
 * observes its own content and posts { type: "EMBED_SIZE", height } to the
 * parent; we match the sender against this iframe's contentWindow so multiple
 * embeds on one page never cross wires.
 */
export function LiveFrame({ src, title, initialHeight }: LiveFrameProps) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(initialHeight);
  // The embed is a full separate document: it must load React and render the
  // block client-side before anything is visible. Until then the iframe is a
  // blank box, which reads as "broken". Show a placeholder until the block
  // reports its first measured size (the real "block is on screen" signal).
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== ref.current?.contentWindow) return;
      const data = event.data as { type?: string; height?: number };
      if (
        data?.type === "EMBED_SIZE" &&
        typeof data.height === "number" &&
        data.height > 0
      ) {
        setHeight(Math.ceil(data.height));
        setReady(true);
      }
    };
    window.addEventListener("message", onMessage);

    // EMBED_SIZE (posted after the block hydrates and measures itself) is the
    // real "ready" signal. The iframe's own load event fires earlier, before
    // hydration, so we treat it only as a safety net: if a block never reports
    // a size, reveal it a few seconds after load so the placeholder can't get
    // permanently stuck.
    const frame = ref.current;
    let fallback: ReturnType<typeof setTimeout> | undefined;
    const onLoad = () => {
      fallback = setTimeout(() => setReady(true), 4000);
    };
    frame?.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("message", onMessage);
      frame?.removeEventListener("load", onLoad);
      if (fallback) clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      className="relative w-full transition-[height] duration-300"
      style={{ height }}
    >
      <iframe
        ref={ref}
        src={src}
        title={title}
        loading="lazy"
        scrolling="no"
        className="h-full w-full bg-background"
      />
      {ready ? null : (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 bg-background text-sm text-muted-foreground">
          <span className="size-3.5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
          Loading preview…
        </div>
      )}
    </div>
  );
}
