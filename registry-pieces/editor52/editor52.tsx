"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface SettingRow {
  label: string;
  value: string;
}

interface SettingGroup {
  label: string;
  rows: SettingRow[];
}

interface Editor52Props {
  title?: string;
  groups?: SettingGroup[];
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

export const editor52Demo: Editor52Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  title: "Appearance",
  groups: [
    {
      label: "Images",
      rows: [
        { label: "Image entrance", value: "Blur in" },
        { label: "Scroll effect", value: "Parallax" },
      ],
    },
    {
      label: "Motion",
      rows: [
        { label: "Section animation", value: "Blur in" },
        { label: "Animation speed", value: "Slow (0.8s)" },
      ],
    },
  ],
  stepMs: 340,
};

/* Labels are there from the first frame; only the values travel, so the rows
   never change height while the panel fills in. */
const STYLES = `
@keyframes editor52-in { from { opacity: 0; transform: translateX(0.5rem); } to { opacity: 1; transform: none; } }
.editor52-in { animation: editor52-in 320ms ease-out both; }
@media (prefers-reduced-motion: reduce) { .editor52-in { animation: none; } }
`;

export function Editor52({
  title,
  groups = [],
  stepMs = 340,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Editor52Props) {
  const total = groups.reduce((sum, group) => sum + group.rows.length, 0);
  const [filled, setFilled] = useState(0);

  useEffect(() => {
    if (filled >= total) return;
    const id = setTimeout(() => setFilled((value) => value + 1), stepMs);
    return () => clearTimeout(id);
  }, [filled, total, stepMs]);

  let cursor = -1;

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

        {groups.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <p className="text-xs font-medium text-current/60">
              {group.label}
            </p>
            {group.rows.map((row) => {
              cursor += 1;
              const shown = cursor < filled;

              return (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-3 py-1"
                >
                  <span className="truncate text-xs">
                    {row.label}
                  </span>
                  <span
                    className={cn(
                      "flex shrink-0 items-center gap-1 text-xs text-current/60",
                      shown ? "editor52-in" : "invisible"
                    )}
                  >
                    {row.value}
                    <ChevronDown className="size-3" aria-hidden="true" />
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
