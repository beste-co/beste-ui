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

interface Monitoring12Props {
  total?: number;
  remaining?: number;
  tone?: Tone;
  bordered?: boolean;
  className?: string;
}

const dotClasses: Record<Tone, string> = {
  neutral: "bg-muted-foreground",
  primary: "bg-primary",
  foreground: "bg-foreground",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

export const monitoring12Demo: Monitoring12Props = {
  total: 10,
  remaining: 7,
  tone: "primary",
  bordered: false,
};

export function Monitoring12({
  total = 10,
  remaining = 0,
  tone = "primary",
  bordered = false,
  className,
}: Monitoring12Props) {
  const safeTotal = Math.max(1, total);
  const safeRemaining = Math.min(safeTotal, Math.max(0, remaining));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex items-center gap-3 rounded-full bg-card px-3 py-2 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-1" aria-hidden="true">
          {Array.from({ length: safeTotal }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "size-2 rounded-full",
                i < safeRemaining ? dotClasses[tone] : "bg-muted"
              )}
            />
          ))}
        </div>
        <span className="text-xs font-semibold tabular-nums text-card-foreground">
          {safeRemaining}
          <span className="text-muted-foreground">/{safeTotal}</span>
        </span>
      </div>
    </div>
  );
}
