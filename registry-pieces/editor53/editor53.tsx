"use client";

import { Image as ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface MotionRow {
  label: string;
  value: string;
}

interface Editor53Props {
  fileName?: string;
  slotLabel?: string;
  rows?: MotionRow[];
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

export const editor53Demo: Editor53Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  fileName: "hero-photograph.jpg",
  slotLabel: "Hero media",
  rows: [
    { label: "Entrance", value: "Blur in" },
    { label: "Scroll effect", value: "Parallax" },
    { label: "Strength", value: "Strong" },
  ],
};

/* The thumbnail performs the two settings underneath it: a blur entrance, then
   a slow drift, then a fade so the loop restarts without a visible cut. The
   tile it sits in is a fixed size, so none of this moves the card. */
const STYLES = `
@keyframes editor53-demo {
  0%   { opacity: 0; filter: blur(6px); transform: translateY(0.375rem) scale(1.06); }
  22%  { opacity: 1; filter: blur(0);   transform: translateY(0.25rem) scale(1.04); }
  82%  { opacity: 1; filter: blur(0);   transform: translateY(-0.25rem) scale(1.02); }
  100% { opacity: 0; filter: blur(2px); transform: translateY(-0.375rem) scale(1); }
}
.editor53-demo { animation: editor53-demo 3600ms ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .editor53-demo { animation: none; } }
`;

export function Editor53({
  fileName,
  slotLabel,
  rows = [],
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Editor53Props) {
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
        <div className="flex items-center gap-3">
          <div
            className="relative size-12 shrink-0 overflow-hidden rounded-md bg-current/10"
            aria-hidden="true"
          >
            <span className="editor53-demo absolute inset-0 flex items-center justify-center bg-current/10">
              <ImageIcon className="size-5 opacity-60" />
            </span>
          </div>
          <div className="flex min-w-0 flex-col">
            {fileName && (
              <span className="truncate text-xs font-medium">
                {fileName}
              </span>
            )}
            {slotLabel && (
              <span className="truncate text-xs opacity-60">
                {slotLabel}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-3 py-0.5"
            >
              <span className="truncate text-xs">
                {row.label}
              </span>
              <span className="shrink-0 text-xs opacity-60">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
