"use client";

import { Waves } from "lucide-react";
import { cn } from "@/lib/utils";

interface Travel22Props {
  title?: string;
  amenities?: string[];
  bordered?: boolean;
  className?: string;
}

export const travel22Demo: Travel22Props = {
  title: "Property amenities",
  amenities: [
    "Free Wi-Fi",
    "Rooftop pool",
    "Air-conditioning",
    "Breakfast included",
  ],
  bordered: false,
};

export function Travel22({
  title,
  amenities = [],
  bordered = false,
  className,
}: Travel22Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <Waves className="size-4 shrink-0 text-sky-500" aria-hidden="true" />
          {title && (
            <span className="text-xs font-semibold text-muted-foreground">
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
