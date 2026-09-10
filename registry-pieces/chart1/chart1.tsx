"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Tone = "primary" | "foreground" | "success" | "muted";

interface Chart1Props {
  label?: string;
  value?: string;
  data?: number[];
  tone?: Tone;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  success: "bg-emerald-500",
  muted: "bg-current/40",
};


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

export const chart1Demo: Chart1Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  label: "Sessions · this week",
  value: "8,214",
  data: [42, 68, 54, 81, 36, 72, 90],
  tone: "primary",
};

export function Chart1({
  label,
  value,
  data = [],
  tone = "primary",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Chart1Props) {
  const max = data.length > 0 ? Math.max(...data, 1) : 1;

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-52 flex-col gap-2 rounded-lg px-3 py-2.5 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-medium text-current/60">
            {label}
          </span>
          <span className="text-sm font-semibold tabular-nums">
            {value}
          </span>
        </div>
        <div
          className="flex h-10 items-end gap-1"
          aria-hidden="true"
        >
          {data.map((d, i) => (
            <span
              key={i}
              className={cn(
                "flex-1 rounded-sm transition-all",
                toneClasses[tone]
              )}
              style={{ height: `${Math.max(6, (d / max) * 100)}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
