"use client";

import { useEffect, useState } from "react";
import { ChevronDown, PanelRight } from "lucide-react";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface SettingRow {
  label: string;
  value: string;
}

interface Editor55Props {
  sectionLabel?: string;
  sectionId?: string;
  rows?: SettingRow[];
  dwellMs?: number;
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

export const editor55Demo: Editor55Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  sectionLabel: "Feature",
  sectionId: "#feature283",
  rows: [
    { label: "Padding", value: "96 px" },
    { label: "Container", value: "7xl" },
    { label: "Background", value: "Background" },
    { label: "Card borders", value: "Per block" },
  ],
  dwellMs: 900,
};

/* The highlight is a background only, so nothing in the panel moves while it
   travels. Row heights are fixed from the first frame. */
const STYLES = `
@keyframes editor55-glow { from { opacity: 0; } to { opacity: 1; } }
.editor55-glow { animation: editor55-glow 260ms ease-out both; }
@media (prefers-reduced-motion: reduce) { .editor55-glow { animation: none; } }
`;

export function Editor55({
  sectionLabel,
  sectionId,
  rows = [],
  dwellMs = 900,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Editor55Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (rows.length < 2) return;
    const id = setInterval(
      () => setActive((value) => (value + 1) % rows.length),
      dwellMs
    );
    return () => clearInterval(id);
  }, [rows.length, dwellMs]);

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
        <div className="flex items-center gap-2">
          <PanelRight
            className="size-3.5 shrink-0 opacity-60"
            aria-hidden="true"
          />
          {sectionLabel && (
            <span className="truncate text-sm font-semibold">
              {sectionLabel}
            </span>
          )}
          {sectionId && (
            <span className="truncate font-mono text-xs opacity-60">
              {sectionId}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          {rows.map((row, index) => (
            <div
              key={row.label}
              className={cn(
                "-mx-2 flex items-center justify-between gap-3 rounded-md px-2 py-1.5",
                index === active && "editor55-glow bg-current/10"
              )}
            >
              <span className="truncate text-xs">
                {row.label}
              </span>
              <span className="flex shrink-0 items-center gap-1 text-xs opacity-60">
                {row.value}
                <ChevronDown className="size-3" aria-hidden="true" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
