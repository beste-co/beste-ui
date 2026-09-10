"use client";

import { MoreHorizontal, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

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
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const TICKS = 44;

const tickStyles: Record<SegmentTone, string> = {
  emerald: "bg-emerald-600",
  amber: "bg-amber-500",
  muted: "bg-current/10",
};

const dotStyles: Record<SegmentTone, string> = {
  emerald: "bg-emerald-600",
  amber: "bg-amber-500",
  muted: "bg-current/15",
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

export const stats14Demo: Stats14Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
  surface = "card",
  bordered = true,
  inverted = false,
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

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("w-full max-w-96 rounded-md p-5 shadow-xl", surfaceTone, bordered && "border border-current/15")}>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-base font-medium">{title}</p>
          <MoreHorizontal
            className="size-4 text-current/60"
            aria-hidden="true"
          />
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-semibold tracking-tight">
            {value}
          </span>
          {deltaLabel && (
            <span className="flex items-center gap-1 text-sm text-current/60">
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
              <span className="font-medium">
                {segment.value}
              </span>
              <span className="text-current/60">{segment.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
