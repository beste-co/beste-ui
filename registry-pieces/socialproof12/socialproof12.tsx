"use client";

import { cn } from "@/lib/utils";

interface Socialproof12Props {
  name?: string;
  city?: string;
  time?: string;
  className?: string;
}

export const socialproof12Demo: Socialproof12Props = {
  name: "Sarah",
  city: "Berlin",
  time: "2 min ago",
};

export function Socialproof12({
  name = "Someone",
  city,
  time,
  className,
}: Socialproof12Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-3 py-1.5 shadow-sm">
        <span className="relative flex size-2 items-center justify-center">
          <span
            className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60"
            aria-hidden="true"
          />
          <span
            className="relative size-2 rounded-full bg-emerald-500"
            aria-hidden="true"
          />
        </span>
        <span className="text-xs text-card-foreground">
          <span className="font-semibold">{name}</span>
          {city && (
            <span className="text-muted-foreground"> from {city}</span>
          )}{" "}
          just signed up
        </span>
        {time && (
          <span className="text-xs text-muted-foreground">· {time}</span>
        )}
      </div>
    </div>
  );
}
