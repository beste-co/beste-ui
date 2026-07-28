"use client";

import { cn } from "@/lib/utils";

interface Ticket3Props {
  origin?: string;
  destination?: string;
  departTime?: string;
  arriveTime?: string;
  service?: string;
  platform?: string;
  platformLabel?: string;
  className?: string;
}

export const ticket3Demo: Ticket3Props = {
  origin: "Berlin Hbf",
  destination: "München Hbf",
  departTime: "09:42",
  arriveTime: "13:05",
  service: "ICE 624",
  platform: "7",
  platformLabel: "Platform",
};

export function Ticket3({
  origin,
  destination,
  departTime,
  arriveTime,
  service,
  platform,
  platformLabel = "Platform",
  className,
}: Ticket3Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-80 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="flex items-center p-3">
          <div className="min-w-0 flex-1">
            <div className="font-mono text-base font-bold text-card-foreground">
              {departTime}
            </div>
            <div className="truncate text-sm text-card-foreground">
              {origin}
            </div>
          </div>
          <span
            className="px-3 text-base text-muted-foreground"
            aria-hidden="true"
          >
            →
          </span>
          <div className="min-w-0 flex-1 text-right">
            <div className="font-mono text-base font-bold text-card-foreground">
              {arriveTime}
            </div>
            <div className="truncate text-sm text-card-foreground">
              {destination}
            </div>
          </div>
        </div>
        <div
          className="border-t border-dashed border-border"
          aria-hidden="true"
        />
        <div className="flex items-center justify-between bg-muted px-3 py-1.5 text-xs">
          <span className="font-mono font-semibold text-card-foreground">
            {service}
          </span>
          {platform && (
            <span className="text-muted-foreground">
              {platformLabel} {platform}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
