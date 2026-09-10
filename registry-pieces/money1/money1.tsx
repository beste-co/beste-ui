"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Tone = "primary" | "foreground" | "sunset" | "emerald" | "violet";

interface Money1Props {
  symbol?: string;
  name?: string;
  price?: string;
  delta?: number;
  tone?: Tone;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sunset: "bg-gradient-to-br from-amber-400 to-orange-500 text-white",
  emerald: "bg-gradient-to-br from-emerald-400 to-teal-500 text-white",
  violet: "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white",
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

export const money1Demo: Money1Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  symbol: "BTC",
  name: "Bitcoin",
  price: "$67,420.30",
  delta: 2.4,
  tone: "primary",
};

export function Money1({
  symbol = "BTC",
  name,
  price,
  delta = 0,
  tone = "primary",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Money1Props) {
  const isUp = delta >= 0;
  const TrendIcon = isUp ? TrendingUp : TrendingDown;
  const trendColor = isUp
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-rose-600 dark:text-rose-400";

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-64 items-center gap-3 rounded-lg px-3 py-2.5 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full shadow-sm",
            toneClasses[tone]
          )}
        >
          <span className="font-mono text-xs font-bold">{symbol}</span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          {name && (
            <span className="truncate text-xs text-current/60">
              {name}
            </span>
          )}
          <span className="truncate text-base font-semibold tabular-nums">
            {price}
          </span>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-0.5 text-sm font-semibold tabular-nums",
            trendColor
          )}
        >
          <TrendIcon className="size-3.5" aria-hidden="true" />
          {isUp ? "+" : ""}
          {delta}%
        </span>
      </div>
    </div>
  );
}
