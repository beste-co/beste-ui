"use client";

import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Tone =
  | "primary"
  | "foreground"
  | "indigo"
  | "violet"
  | "emerald"
  | "sunset";

interface Media1Props {
  label?: string;
  duration?: string;
  bars?: number[];
  tone?: Tone;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const buttonClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  foreground: "bg-foreground text-background hover:bg-current/90",
  indigo: "bg-indigo-500 text-white hover:bg-indigo-600",
  violet: "bg-violet-500 text-white hover:bg-violet-600",
  emerald: "bg-emerald-500 text-white hover:bg-emerald-600",
  sunset: "bg-orange-500 text-white hover:bg-orange-600",
};

const barClasses: Record<Tone, string> = {
  primary: "bg-primary/70",
  foreground: "bg-current/70",
  indigo: "bg-indigo-500/70",
  violet: "bg-violet-500/70",
  emerald: "bg-emerald-500/70",
  sunset: "bg-orange-500/70",
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

export const media1Demo: Media1Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  label: "Voice memo",
  duration: "0:42",
  bars: [30, 55, 70, 40, 85, 65, 90, 50, 75, 45, 80, 60, 35, 70, 55],
  tone: "indigo",
};

export function Media1({
  label,
  duration,
  bars = [],
  tone = "indigo",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Media1Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-64 items-center gap-3 rounded-full py-1.5 pl-1.5 pr-4 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <button
          type="button"
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full shadow-sm transition-colors",
            buttonClasses[tone]
          )}
          aria-label="Play"
        >
          <Play className="size-3.5 fill-current" />
        </button>
        <div
          className="flex h-6 flex-1 items-center gap-0.5"
          aria-hidden="true"
        >
          {bars.map((h, i) => (
            <span
              key={i}
              className={cn(
                "flex-1 animate-pulse rounded-full",
                barClasses[tone]
              )}
              style={{
                height: `${h}%`,
                animationDelay: `${i * 80}ms`,
                animationDuration: "1.4s",
              }}
            />
          ))}
        </div>
        {duration && (
          <span className="shrink-0 font-mono text-xs tabular-nums text-current/60">
            {duration}
          </span>
        )}
        {label && !duration && (
          <span className="shrink-0 text-xs text-current/60">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
