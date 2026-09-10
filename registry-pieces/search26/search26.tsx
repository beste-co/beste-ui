"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface MatchRow {
  id: string;
  kind: string;
  /** 1 to 3. How well this section answered the brief. */
  strength?: 1 | 2 | 3;
}

interface Search26Props {
  brief?: string;
  scanningLabel?: string;
  resultsLabel?: string;
  matches?: MatchRow[];
  restLabel?: string;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  stepMs?: number;
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

export const search26Demo: Search26Props = {
  brief: "A ceramics studio in Porto that runs weekend classes.",
  scanningLabel: "Reading the brief",
  resultsLabel: "matched",
  matches: [
    { id: "hero181", kind: "Hero", strength: 3 },
    { id: "event103", kind: "Event", strength: 3 },
    { id: "feature287", kind: "Feature", strength: 2 },
  ],
  restLabel: "24 more",
  surface: "card",
  bordered: true,
  inverted: false,
  stepMs: 460,
};

const STYLES = `
@keyframes search26-in { from { opacity: 0; transform: translateY(0.375rem); } to { opacity: 1; transform: none; } }
@keyframes search26-sweep { from { transform: translateX(-100%); } to { transform: translateX(200%); } }
.search26-in { animation: search26-in 320ms ease-out both; }
.search26-sweep { animation: search26-sweep 1600ms linear infinite; }
@media (prefers-reduced-motion: reduce) {
  .search26-in { animation: none; }
  .search26-sweep { display: none; }
}
`;

export function Search26({
  brief,
  scanningLabel = "Reading the brief",
  resultsLabel = "matched",
  matches = [],
  restLabel,
  surface = "card",
  bordered = true,
  inverted = false,
  stepMs = 460,
  className,
}: Search26Props) {
  const [landed, setLanded] = useState(0);
  const scanning = landed === 0;

  useEffect(() => {
    if (landed >= matches.length) return;
    const id = setTimeout(() => setLanded((value) => value + 1), stepMs);
    return () => clearTimeout(id);
  }, [landed, matches.length, stepMs]);

  const tone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{STYLES}</style>

      <div
        className={cn(
          "flex w-full max-w-72 flex-col gap-3 rounded-xl p-4 shadow-sm",
          tone,
          bordered && "border border-current/15"
        )}
      >
        {brief && (
          <div className="relative overflow-hidden rounded-md bg-current/10 px-2.5 py-2">
            <p className="line-clamp-2 text-xs leading-relaxed">{brief}</p>
            {scanning && (
              <span
                className="search26-sweep pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-current/20 to-transparent"
                aria-hidden="true"
              />
            )}
          </div>
        )}

        <div className="flex items-baseline justify-between gap-3">
          <span className="truncate text-xs font-medium opacity-60">
            {scanning ? scanningLabel : resultsLabel}
            {!scanning && restLabel ? ` · ${restLabel}` : ""}
          </span>
          {/* Always mounted, only hidden. Landing data must never change the
              card's height, and this is the one line tall enough to do it. */}
          <span
            className={cn(
              "shrink-0 text-xl font-light leading-none tabular-nums",
              scanning ? "invisible" : "search26-in"
            )}
          >
            {landed}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {matches.map((match, index) => {
            const shown = index < landed;
            const level = match.strength ?? 3;

            return (
              <div
                key={match.id}
                className={cn(
                  "flex items-baseline gap-2.5",
                  shown ? "search26-in" : "invisible"
                )}
              >
                <code className="min-w-0 flex-1 truncate font-mono text-xs">
                  {match.id}
                </code>
                <span className="shrink-0 text-xs opacity-60">
                  {match.kind}
                </span>
                <span
                  className="h-1 w-10 shrink-0 overflow-hidden rounded-full bg-current/20"
                  aria-hidden="true"
                >
                  <span
                    className="block h-full rounded-full bg-current transition-all duration-500 ease-out motion-reduce:transition-none"
                    style={{ width: shown ? `${(level / 3) * 100}%` : "0%" }}
                  />
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
