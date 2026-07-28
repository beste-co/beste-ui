"use client";

import { cn } from "@/lib/utils";

interface Ticket6Props {
  code?: string;
  headerLabel?: string;
  plate?: string;
  spotPrefix?: string;
  enteredAt?: string;
  level?: string;
  spot?: string;
  className?: string;
}

export const ticket6Demo: Ticket6Props = {
  code: "P-2891",
  headerLabel: "Parking",
  plate: "ABC 1234",
  spotPrefix: "Spot",
  enteredAt: "Jun 14 · 14:32",
  level: "Level 2",
  spot: "B-08",
};

export function Ticket6({
  code,
  headerLabel = "Parking",
  plate,
  spotPrefix = "Spot",
  enteredAt,
  level,
  spot,
  className,
}: Ticket6Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-80 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between bg-muted px-3 py-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {headerLabel}
          </span>
          <span className="font-mono text-xs font-semibold text-card-foreground">
            {code}
          </span>
        </div>
        <div className="flex flex-col gap-1.5 p-3">
          <span className="font-mono text-xl font-bold tracking-wide text-card-foreground">
            {plate}
          </span>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{enteredAt}</span>
            {(level || spot) && (
              <span>
                {level}
                {level && spot && " · "}
                {spot && `${spotPrefix} ${spot}`}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
