"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "emerald"
  | "sky"
  | "violet"
  | "amber"
  | "rose";

interface Monitoring18Props {
  depth?: number;
  capacity?: number;
  tone?: Tone;
  bordered?: boolean;
  className?: string;
}

const segmentClasses: Record<Tone, string> = {
  neutral: "bg-muted-foreground",
  primary: "bg-primary",
  foreground: "bg-foreground",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

const SEGMENTS = 12;

export const monitoring18Demo: Monitoring18Props = {
  depth: 8,
  capacity: 12,
  tone: "primary",
  bordered: false,
};

export function Monitoring18({
  depth = 0,
  capacity = SEGMENTS,
  tone = "primary",
  bordered = false,
  className,
}: Monitoring18Props) {
  const safeCapacity = Math.max(1, capacity);
  const safeDepth = Math.min(safeCapacity, Math.max(0, depth));
  const filled = Math.round((safeDepth / safeCapacity) * SEGMENTS);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex items-center gap-3 rounded-lg bg-card px-3 py-2.5 shadow-sm", bordered && "border border-border")}>
        <div
          className="flex flex-col-reverse gap-0.5"
          aria-hidden="true"
        >
          {Array.from({ length: SEGMENTS }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 w-8 rounded-sm",
                i < filled ? segmentClasses[tone] : "bg-muted"
              )}
            />
          ))}
        </div>
        <div className="flex flex-col items-start gap-1">
          <span className="text-xs font-semibold tabular-nums text-card-foreground">
            {safeDepth}
          </span>
          <span className="h-px w-3 bg-border" aria-hidden="true" />
          <span className="text-xs tabular-nums text-muted-foreground">
            {safeCapacity}
          </span>
        </div>
      </div>
    </div>
  );
}
