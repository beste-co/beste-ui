"use client";

import { useEffect, useRef } from "react";

interface TweetProps {
  /** Canonical tweet URL, e.g. https://x.com/shadcn/status/123 */
  url: string;
  /** Display name, e.g. "shadcn" */
  author: string;
  /** Handle without the @, e.g. "shadcn" */
  handle: string;
  /** Date string exactly as shown on the tweet, e.g. "July 3, 2026" */
  date: string;
  /**
   * Tweet body. Blank lines separate paragraphs; @mentions become links. This
   * is the fallback that renders before (and without) the X widget script, so
   * crawlers and no-JS visitors still get the text.
   */
  text: string;
  /** The embed shows only the opening of a longer tweet or thread. */
  truncated?: boolean;
}

declare global {
  interface Window {
    twttr?: { widgets?: { load: (el?: HTMLElement | null) => void } };
  }
}

const WIDGETS_SRC = "https://platform.x.com/widgets.js";

/**
 * Native X (Twitter) embed. Renders the canonical `blockquote.twitter-tweet`
 * with the tweet text as SSR fallback, then loads X's widgets.js and upgrades
 * that blockquote in place into the full native card (avatar, media, counts).
 *
 * Client component: widgets.js needs the DOM. It mutates our blockquote after
 * mount, which React leaves alone because the change happens in an effect.
 */
export function Tweet({ url, author, handle, date, text }: TweetProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const render = () => {
      const blockquote = ref.current?.querySelector<HTMLElement>(
        ".twitter-tweet"
      );
      if (blockquote) {
        blockquote.setAttribute(
          "data-theme",
          document.documentElement.classList.contains("dark") ? "dark" : "light"
        );
      }
      window.twttr?.widgets?.load(ref.current);
    };

    if (window.twttr?.widgets) {
      render();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${WIDGETS_SRC}"]`
    );
    if (existing) {
      // Script is loading from another embed; poll until the API is ready.
      const poll = window.setInterval(() => {
        if (window.twttr?.widgets) {
          window.clearInterval(poll);
          render();
        }
      }, 100);
      return () => window.clearInterval(poll);
    }

    const script = document.createElement("script");
    script.src = WIDGETS_SRC;
    script.async = true;
    script.addEventListener("load", render);
    document.body.appendChild(script);
  }, []);

  const paragraphs = text.trim().split(/\n{2,}/);

  return (
    <div ref={ref} className="my-8 flex justify-center [&_.twitter-tweet]:mx-auto">
      <blockquote className="twitter-tweet" data-dnt="true">
        <p lang="en" dir="ltr">
          {paragraphs.map((paragraph, index) => (
            <span key={paragraph}>
              {index > 0 ? (
                <>
                  <br />
                  <br />
                </>
              ) : null}
              {paragraph.split(/(@\w+)/g).map((part, partIndex) =>
                part.startsWith("@") ? (
                  <a
                    key={`${paragraph}-${partIndex}`}
                    href={`https://x.com/${part.slice(1)}`}
                  >
                    {part}
                  </a>
                ) : (
                  <span key={`${paragraph}-${partIndex}`}>{part}</span>
                )
              )}
            </span>
          ))}
        </p>
        <a href={url}>
          {author} (@{handle}) · {date}
        </a>
      </blockquote>
    </div>
  );
}
