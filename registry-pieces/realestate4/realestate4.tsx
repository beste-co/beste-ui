"use client";

import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Tone =
  | "primary"
  | "foreground"
  | "sky"
  | "emerald"
  | "violet"
  | "amber"
  | "rose";

interface Realestate4Props {
  neighborhood?: string;
  medianPrice?: string;
  trend?: string;
  daysOnMarket?: string;
  listings?: string;
  tone?: Tone;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const pillClasses: Record<Tone, string> = {
  primary: "bg-primary/10 text-primary",
  foreground: "bg-current/10 text-foreground",
  sky: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  emerald: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  violet: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  amber: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  rose: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
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

export const realestate4Demo: Realestate4Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  neighborhood: "Levent · Istanbul",
  medianPrice: "$1.08M median",
  trend: "+4.2% YoY",
  daysOnMarket: "18 avg days on market",
  listings: "142 active listings",
  tone: "primary",
};

export function Realestate4({
  neighborhood,
  medianPrice,
  trend,
  daysOnMarket,
  listings,
  tone = "primary",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Realestate4Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center justify-between">
          {neighborhood && (
            <span className="text-sm font-semibold">
              {neighborhood}
            </span>
          )}
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                pillClasses[tone]
              )}
            >
              <TrendingUp className="size-3" aria-hidden="true" />
              {trend}
            </span>
          )}
        </div>
        {medianPrice && (
          <span className="font-mono text-xl font-bold">
            {medianPrice}
          </span>
        )}
        <div className="flex items-center justify-between border-t border-current/15 pt-2 text-xs text-current/60">
          {daysOnMarket && <span>{daysOnMarket}</span>}
          {listings && <span>{listings}</span>}
        </div>
      </div>
    </div>
  );
}
