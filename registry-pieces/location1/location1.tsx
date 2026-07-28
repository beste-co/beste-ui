"use client";

import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "destructive" | "warning";

interface Location1Props {
  city?: string;
  country?: string;
  coordinate?: string;
  tone?: Tone;
  className?: string;
}

const tonePinClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  destructive: "bg-destructive text-white",
  warning: "bg-amber-500 text-white",
};

export const location1Demo: Location1Props = {
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
  className,
}: Location1Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-60 items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 shadow-sm">
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
            <span className="truncate text-sm font-semibold text-card-foreground">
              {city}
            </span>
            {country && (
              <span className="truncate text-xs text-muted-foreground">
                {country}
              </span>
            )}
          </div>
          {coordinate && (
            <span className="truncate font-mono text-xs text-muted-foreground">
              {coordinate}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
