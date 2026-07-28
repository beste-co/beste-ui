"use client";

import { MoreHorizontal, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type SegmentTone = "emerald" | "amber" | "muted";

interface Segment {
  label: string;
  value: number;
  tone?: SegmentTone;
}

interface Stats14Props {
  title?: string;
  value?: string;
  deltaLabel?: string;
  segments?: Segment[];
  className?: string;
}

const TICKS = 44;

const tickStyles: Record<SegmentTone, string> = {
  emerald: "bg-emerald-600",
  amber: "bg-amber-500",
  muted: "bg-muted-foreground/25",
};

const dotStyles: Record<SegmentTone, string> = {
  emerald: "bg-emerald-600",
  amber: "bg-amber-500",
  muted: "bg-muted-foreground/40",
};

export const stats14Demo: Stats14Props = {
  title: "Support Queue",
  value: "1,284",
  deltaLabel: "312 cleared today",
  segments: [
    { label: "New", value: 420, tone: "emerald" },
    { label: "Active", value: 610, tone: "amber" },
    { label: "On hold", value: 254, tone: "muted" },
  ],
};

export function Stats14({
  title = "Journeys",
  value = "0",
  deltaLabel,
  segments = [],
  className,
}: Stats14Props) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  // Assign each tick to a segment by walking the cumulative proportion.
  const tickTones: SegmentTone[] = Array.from({ length: TICKS }, (_, i) => {
    const ratio = (i + 0.5) / TICKS;
    let acc = 0;
    for (const s of segments) {
      acc += s.value / total;
      if (ratio <= acc) return s.tone ?? "muted";
    }
    return "muted";
  });

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-96 rounded-md border border-border bg-card p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-base font-medium text-card-foreground">{title}</p>
          <MoreHorizontal
            className="size-4 text-muted-foreground"
            aria-hidden="true"
          />
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-semibold tracking-tight text-card-foreground">
            {value}
          </span>
          {deltaLabel && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <TrendingUp
                className="size-4 text-emerald-600"
                aria-hidden="true"
              />
              <span className="font-medium text-emerald-600">
                {deltaLabel.split(" ")[0]}
              </span>
              {deltaLabel.split(" ").slice(1).join(" ")}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center gap-0.5" aria-hidden="true">
          {tickTones.map((tone, index) => (
            <span
              key={index}
              className={cn("h-6 flex-1 rounded-sm", tickStyles[tone])}
            />
          ))}
        </div>

        <div className="mt-4 flex items-center gap-x-4">
          {segments.map((segment, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 whitespace-nowrap text-sm"
            >
              <span
                className={cn(
                  "size-2 rounded-full",
                  dotStyles[segment.tone ?? "muted"]
                )}
                aria-hidden="true"
              />
              <span className="font-medium text-card-foreground">
                {segment.value}
              </span>
              <span className="text-muted-foreground">{segment.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
