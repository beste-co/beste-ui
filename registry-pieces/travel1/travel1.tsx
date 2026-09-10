"use client";

import { Plane } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "sky"
  | "emerald"
  | "violet"
  | "amber"
  | "rose";

interface Travel1Props {
  airline?: string;
  from?: string;
  to?: string;
  departTime?: string;
  arriveTime?: string;
  duration?: string;
  price?: string;
  tone?: Tone;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  neutral: "bg-current/10 text-foreground",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  violet: "bg-violet-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
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

export const travel1Demo: Travel1Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  airline: "Turkish Airlines",
  from: "IST",
  to: "LHR",
  departTime: "09:40",
  arriveTime: "12:20",
  duration: "4h 40m · Direct",
  price: "$312",
  tone: "neutral",
};

export function Travel1({
  airline,
  from,
  to,
  departTime,
  arriveTime,
  duration,
  price,
  tone = "neutral",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Travel1Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-3 rounded-xl p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex size-7 items-center justify-center rounded-md",
                iconClasses[tone]
              )}
            >
              <Plane className="size-3.5" aria-hidden="true" />
            </div>
            <span className="text-xs font-semibold">
              {airline}
            </span>
          </div>
          {price && (
            <span className="font-mono text-sm font-semibold">
              {price}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-mono text-xl font-semibold">
              {departTime}
            </span>
            <span className="text-xs text-current/60">{from}</span>
          </div>
          <div className="relative flex flex-1 flex-col items-center gap-1">
            <span className="text-xs text-current/60">{duration}</span>
            <div className="relative flex w-full items-center">
              <span
                className="size-1.5 rounded-full bg-border"
                aria-hidden="true"
              />
              <span
                className="h-px flex-1 border-t border-dashed border-current/15"
                aria-hidden="true"
              />
              <span
                className="size-1.5 rounded-full bg-border"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-mono text-xl font-semibold">
              {arriveTime}
            </span>
            <span className="text-xs text-current/60">{to}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
