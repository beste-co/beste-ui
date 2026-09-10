"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface IntegrationRow {
  name: string;
  /** Rows left out of this stay blank on the right, the way an unused one does. */
  active?: boolean;
}

interface Editor56Props {
  title?: string;
  integrations?: IntegrationRow[];
  activeLabel?: string;
  stepMs?: number;
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

export const editor56Demo: Editor56Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  title: "Integrations",
  integrations: [
    { name: "Google Analytics", active: true },
    { name: "Google Tag Manager", active: true },
    { name: "Meta Pixel" },
    { name: "PostHog", active: true },
  ],
  activeLabel: "Active",
  stepMs: 420,
};

/* Names hold every row open from the first frame; only the status arrives, so
   the list never changes height as it connects. */
const STYLES = `
@keyframes editor56-in { from { opacity: 0; transform: translateX(0.375rem); } to { opacity: 1; transform: none; } }
.editor56-in { animation: editor56-in 300ms ease-out both; }
@media (prefers-reduced-motion: reduce) { .editor56-in { animation: none; } }
`;

export function Editor56({
  title,
  integrations = [],
  activeLabel = "Active",
  stepMs = 420,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Editor56Props) {
  const [connected, setConnected] = useState(0);

  useEffect(() => {
    if (connected >= integrations.length) return;
    const id = setTimeout(() => setConnected((value) => value + 1), stepMs);
    return () => clearTimeout(id);
  }, [connected, integrations.length, stepMs]);

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

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
          surfaceTone,
          bordered && "border border-current/15"
        )}
      >
        {title && (
          <span className="block text-sm font-semibold">
            {title}
          </span>
        )}

        <div className="flex flex-col gap-1">
          {integrations.map((row, index) => {
            const settled = index < connected;

            return (
              <div
                key={row.name}
                className="flex items-center justify-between gap-3 py-0.5"
              >
                <span className="truncate text-xs">
                  {row.name}
                </span>
                <span
                  className={cn(
                    "shrink-0 text-xs",
                    inverted ? "text-emerald-400" : "text-emerald-600 dark:text-emerald-400",
                    settled && row.active ? "editor56-in" : "invisible"
                  )}
                >
                  {activeLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
