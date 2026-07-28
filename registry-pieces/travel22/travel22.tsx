"use client";

import { Waves } from "lucide-react";
import { cn } from "@/lib/utils";

interface Amenity {
  label: string;
  icon: string;
}

interface Travel22Props {
  title?: string;
  amenities?: string[];
  className?: string;
}

export const travel22Demo: Travel22Props = {
  title: "Property amenities",
  amenities: [
    "Free Wi-Fi",
    "Rooftop pool",
    "Air-conditioning",
    "Breakfast included",
    "Airport shuttle",
    "Pet friendly",
  ],
};

export function Travel22({
  title,
  amenities = [],
  className,
}: Travel22Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-sky-500/15 text-sky-500">
            <Waves className="size-3.5" aria-hidden="true" />
          </div>
          {title && (
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {title}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {amenities.map((a, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-md bg-muted/60 px-2 py-1.5 text-xs"
            >
              <span
                className="size-1.5 shrink-0 rounded-full bg-sky-500"
                aria-hidden="true"
              />
              <span className="truncate text-card-foreground">{a}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
