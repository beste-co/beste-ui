"use client";

import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Tone = "primary" | "foreground" | "destructive" | "warning";

interface Location1Props {
  city?: string;
  country?: string;
  coordinate?: string;
  tone?: Tone;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const tonePinClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  destructive: "bg-destructive text-white",
  warning: "bg-amber-500 text-white",
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

export const location1Demo: Location1Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  city: "Istanbul",
  country: "Türkiye",
  coordinate: "41.01°N · 28.98°E",
  tone: "primary",
};

export function Location1({
  city,
  country,
  coordinate,
  tone = "primary",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Location1Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-60 items-center gap-3 rounded-lg px-3 py-2 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full shadow-sm",
            tonePinClasses[tone]
          )}
        >
          <MapPin
            className="size-4 fill-white/20"
            aria-hidden="true"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="truncate text-sm font-semibold">
              {city}
            </span>
            {country && (
              <span className="truncate text-xs text-current/60">
                {country}
              </span>
            )}
          </div>
          {coordinate && (
            <span className="truncate font-mono text-xs text-current/60">
              {coordinate}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
