"use client";

import { cn } from "@/lib/utils";

type SegmentTone =
  | "primary"
  | "foreground"
  | "emerald"
  | "sky"
  | "amber"
  | "rose"
  | "violet"
  | "muted";

interface Segment {
  label: string;
  value: number;
  tone: SegmentTone;
}

interface Progress6Props {
  title?: string;
  segments?: Segment[];
  className?: string;
}

const toneClasses: Record<SegmentTone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  violet: "bg-violet-500",
  muted: "bg-muted-foreground",
};

export const progress6Demo: Progress6Props = {
  title: "Storage breakdown",
  segments: [
    { label: "Media", value: 42, tone: "emerald" },
    { label: "Docs", value: 18, tone: "sky" },
    { label: "Cache", value: 12, tone: "amber" },
    { label: "Other", value: 8, tone: "muted" },
  ],
};

export function Progress6({
  title,
  segments = [],
  className,
}: Progress6Props) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-2">
        {title && (
          <span className="text-sm font-medium text-card-foreground">
            {title}
          </span>
        )}
        <div
          className="flex h-2 w-full overflow-hidden rounded-full bg-muted"
          aria-hidden="true"
        >
          {segments.map((seg, i) => (
            <span
              key={i}
              className={cn("h-full", toneClasses[seg.tone])}
              style={{ width: `${(seg.value / total) * 100}%` }}
            />
          ))}
        </div>
        <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
          {segments.map((seg, i) => (
            <li key={i} className="flex items-center gap-1.5">
              <span
                className={cn("size-2 rounded-full", toneClasses[seg.tone])}
                aria-hidden="true"
              />
              <span className="text-muted-foreground">{seg.label}</span>
              <span className="font-semibold tabular-nums text-card-foreground">
                {Math.round((seg.value / total) * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
