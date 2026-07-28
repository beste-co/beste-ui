"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Day {
  label: string;
  /** Bar height as a fraction of the track, 0 to 1 */
  value: number;
  active?: boolean;
}

interface Chart6Props {
  title?: string;
  rangeLabel?: string;
  peakLabel?: string;
  footnote?: string;
  days?: Day[];
  className?: string;
}

export const chart6Demo: Chart6Props = {
  title: "Deployments",
  rangeLabel: "Wk 24",
  peakLabel: "128 builds",
  footnote: "92% passing",
  days: [
    { label: "Mon", value: 0.5 },
    { label: "Tue", value: 0.86, active: true },
    { label: "Wed", value: 0.44 },
    { label: "Thu", value: 0.3 },
  ],
};

export function Chart6({
  title = "Journeys",
  rangeLabel,
  peakLabel,
  footnote,
  days = [],
  className,
}: Chart6Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-80 rounded-md bg-foreground p-5 text-background shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm font-medium">
            {title}
            <ChevronDown className="size-4 text-background/60" aria-hidden="true" />
          </div>
          {rangeLabel && (
            <span className="text-sm text-background/60">{rangeLabel}</span>
          )}
        </div>

        <div className="relative mt-6 h-32">
          {/* Threshold line */}
          
          <div className="flex h-full items-end justify-between gap-3">
            {days.map((day, index) => (
              <div
                key={index}
                className="relative flex h-full flex-1 flex-col items-center justify-end"
              >
                {day.active && peakLabel && (
                  <span className="absolute -top-1 z-10 whitespace-nowrap rounded-full bg-background/15 px-2 py-0.5 text-xs font-medium text-background">
                    {peakLabel}
                  </span>
                )}
                <div
                  className={cn(
                    "w-full rounded-sm",
                    day.active ? "bg-emerald-300/80" : "bg-background/10"
                  )}
                  style={{ height: `${Math.max(0, Math.min(day.value, 1)) * 100}%` }}
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          {days.map((day, index) => (
            <span
              key={index}
              className={cn(
                "flex-1 text-center text-sm",
                day.active
                  ? "font-medium text-background"
                  : "text-background/50"
              )}
            >
              {day.label}
            </span>
          ))}
        </div>

        {footnote && (
          <p className="mt-4 text-center text-sm font-medium text-background/80">
            {footnote}
          </p>
        )}
      </div>
    </div>
  );
}
