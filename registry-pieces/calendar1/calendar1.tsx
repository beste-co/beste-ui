"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Tone = "foreground" | "primary" | "destructive";

interface Calendar1Props {
  month?: string;
  day?: string;
  weekday?: string;
  tone?: Tone;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const toneStripClasses: Record<Tone, string> = {
  foreground: "bg-foreground text-background",
  primary: "bg-primary text-primary-foreground",
  destructive: "bg-destructive text-white",
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

export const calendar1Demo: Calendar1Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  month: "APR",
  day: "21",
  weekday: "Tuesday",
  tone: "destructive",
};

export function Calendar1({
  month,
  day,
  weekday,
  tone = "destructive",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Calendar1Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-24 flex-col overflow-hidden rounded-lg shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div
          className={cn(
            "flex h-5 items-center justify-center text-xs font-bold uppercase tracking-wider",
            toneStripClasses[tone]
          )}
        >
          {month}
        </div>
        <div className="flex flex-col items-center gap-0.5 px-2 py-2">
          <span className="text-3xl font-bold leading-none tabular-nums">
            {day}
          </span>
          <span className="text-xs font-medium uppercase tracking-wide text-current/60">
            {weekday}
          </span>
        </div>
      </div>
    </div>
  );
}
