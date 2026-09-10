"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Tone = "primary" | "emerald" | "amber";

interface Stats15Props {
  label?: string;
  percent?: number;
  caption?: string;
  tone?: Tone;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const ringStyles: Record<Tone, string> = {
  primary: "text-primary",
  emerald: "text-emerald-600",
  amber: "text-amber-500",
};

const RADIUS = 16;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;


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

export const stats15Demo: Stats15Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  label: "Capacity used",
  percent: 78,
  caption: "of licensed seats",
};

export function Stats15({
  label = "Progress",
  percent = 0,
  caption,
  tone = "primary",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Stats15Props) {
  const clamped = Math.max(0, Math.min(percent, 100));
  const offset = CIRCUMFERENCE * (1 - clamped / 100);

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 items-center gap-4 rounded-md p-5 shadow-xl", surfaceTone, bordered && "border border-current/15")}>
        <div className="relative size-16 shrink-0">
          <svg viewBox="0 0 36 36" className="size-full -rotate-90">
            <circle
              cx="18"
              cy="18"
              r={RADIUS}
              fill="none"
              strokeWidth="3"
              className="stroke-muted"
            />
            <circle
              cx="18"
              cy="18"
              r={RADIUS}
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              className={cn("stroke-current", ringStyles[tone])}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
            {clamped}%
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-base font-medium">{label}</p>
          {caption && (
            <p className="truncate text-sm text-current/60">{caption}</p>
          )}
        </div>
      </div>
    </div>
  );
}
