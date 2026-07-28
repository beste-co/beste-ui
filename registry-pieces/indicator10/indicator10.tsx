"use client";

import { cn } from "@/lib/utils";

interface Indicator10Props {
  level?: 0 | 1 | 2 | 3 | 4;
  network?: string;
  label?: string;
  className?: string;
}

const barHeights = ["h-1.5", "h-3", "h-4", "h-5"];

export const indicator10Demo: Indicator10Props = {
  level: 3,
  network: "5G",
  label: "Good",
};

export function Indicator10({
  level = 0,
  network,
  label,
  className,
}: Indicator10Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-end gap-2">
        <span
          className="flex items-end gap-0.5"
          aria-hidden="true"
        >
          {barHeights.map((h, idx) => (
            <span
              key={idx}
              className={cn(
                "w-1 rounded-sm",
                h,
                idx < level ? "bg-foreground" : "bg-muted"
              )}
            />
          ))}
        </span>
        <div className="flex items-baseline gap-1.5 leading-none">
          {network && (
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-card-foreground">
              {network}
            </span>
          )}
          {label && (
            <span className="text-xs text-muted-foreground">{label}</span>
          )}
        </div>
      </div>
    </div>
  );
}
