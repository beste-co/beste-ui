"use client";

import { useEffect, useRef } from "react";

interface TwitterWidgets {
  widgets?: { load?: (el?: HTMLElement | null) => void };
}

const WIDGETS_SRC = "https://platform.x.com/widgets.js";
const SCRIPT_ID = "twitter-wjs";

/**
 * Embeds an X/Twitter status. Renders the standard blockquote and lazily
 * loads widgets.js, then asks it to hydrate this instance. Falls back to a
 * plain link before the script loads.
 */
export function TweetEmbed({ url, className }: { url: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const twttr = (window as unknown as { twttr?: TwitterWidgets }).twttr;
    const hydrate = () => {
      (window as unknown as { twttr?: TwitterWidgets }).twttr?.widgets?.load?.(
        ref.current
      );
    };

    if (twttr?.widgets) {
      hydrate();
      return;
    }

    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener("load", hydrate);
      return () => existing.removeEventListener("load", hydrate);
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = WIDGETS_SRC;
    script.async = true;
    script.addEventListener("load", hydrate);
    document.body.appendChild(script);
  }, []);

  return (
    <div ref={ref} className={className}>
      {/* biome-ignore lint/a11y/useValidAnchor: widgets.js replaces this node */}
      <blockquote className="twitter-tweet" data-dnt="true">
        <a href={url}>{url}</a>
      </blockquote>
    </div>
  );
}
