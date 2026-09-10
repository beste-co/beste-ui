"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface TokenOption {
  token: string;
  probability: number;
}

interface Ai16Props {
  title?: string;
  context?: string;
  tokens?: TokenOption[];
  topPrefix?: string;
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

export const ai16Demo: Ai16Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  title: "next_token",
  context: "The capital of France is",
  topPrefix: "top",
  tokens: [
    { token: "Paris", probability: 0.643 },
    { token: "the", probability: 0.187 },
    { token: "located", probability: 0.081 },
    { token: "also", probability: 0.042 },
    { token: "a", probability: 0.021 },
  ],
};

export function Ai16({
  title = "next_token",
  context,
  tokens = [],
  topPrefix = "top",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Ai16Props) {
  const top = tokens.reduce((m, t) => Math.max(m, t.probability), 0);

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
          <span className="font-mono text-xs font-semibold uppercase tracking-wide text-current/60">
            {title}
          </span>
          <span className="font-mono text-xs text-current/60">
            {topPrefix} {tokens.length}
          </span>
        </div>
        {context && (
          <div className="border-b border-current/15 px-3 py-2 font-mono text-xs leading-relaxed">
            <span className="text-current/35">&ldquo;</span>
            {context}
            <span
              className="ml-0.5 inline-block h-3 w-0.5 -translate-y-px bg-current align-middle animate-pulse"
              aria-hidden="true"
            />
            <span className="text-current/35">&rdquo;</span>
          </div>
        )}
        <ul className="flex flex-col divide-y divide-border">
          {tokens.map((t, i) => {
            const pctWidth = top > 0 ? (t.probability / top) * 100 : 0;
            const pct = (t.probability * 100).toFixed(1);
            const isTop = i === 0;
            return (
              <li
                key={t.token}
                className="relative px-3 py-1.5"
              >
                <div
                  className={cn(
                    "absolute inset-y-0.5 left-0",
                    isTop ? "bg-emerald-500/15" : "bg-current/10"
                  )}
                  style={{ width: `${pctWidth}%` }}
                  aria-hidden="true"
                />
                <div className="relative flex items-center justify-between gap-3 font-mono text-xs">
                  <span className="flex min-w-0 items-center">
                    <span className="text-current/35">
                      &ldquo;
                    </span>
                    <span
                      className={cn(
                        "truncate",
                        isTop
                          ? "font-semibold text-emerald-700 dark:text-emerald-400"
                          : ""
                      )}
                    >
                      {t.token}
                    </span>
                    <span className="text-current/35">
                      &rdquo;
                    </span>
                  </span>
                  <span className="shrink-0 tabular-nums text-current/60">
                    {pct}%
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
