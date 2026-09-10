"use client";

import { Check, Copy, RotateCw } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Ai12Props {
  language?: string;
  code?: string;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const ai12Demo: Ai12Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  language: "ts",
  code: "const slug = (s: string) =>\n  s.toLowerCase().replace(/\\s+/g, '-');",
};

export function Ai12({
  language = "code",
  code = "",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Ai12Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* noop */
    }
  };

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col overflow-hidden rounded-md shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center justify-between border-b border-current/15 px-3 py-1.5">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-current/60">
            {language}
          </span>
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? "Copied" : "Copy"}
              className="flex size-6 items-center justify-center rounded text-current/60 transition-colors hover:bg-current/10 hover:text-current"
            >
              {copied ? (
                <Check className="size-3 text-emerald-500" aria-hidden="true" />
              ) : (
                <Copy className="size-3" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              aria-label="Regenerate"
              className="flex size-6 items-center justify-center rounded text-current/60 transition-colors hover:bg-current/10 hover:text-current"
            >
              <RotateCw className="size-3" aria-hidden="true" />
            </button>
          </div>
        </div>
        <pre className="overflow-auto px-3 py-2 font-mono text-xs leading-relaxed">
          {code}
        </pre>
      </div>
    </div>
  );
}
