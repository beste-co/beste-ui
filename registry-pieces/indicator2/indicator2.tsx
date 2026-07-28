"use client";

import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "success";

interface Indicator2Props {
  total?: number;
  current?: number;
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  success: "bg-emerald-500",
};

export const indicator2Demo: Indicator2Props = {
  total: 5,
  current: 3,
  tone: "primary",
};

export function Indicator2({
  total = 5,
  current = 0,
  tone = "primary",
  className,
}: Indicator2Props) {
  const clampedTotal = Math.max(1, total);
  const clampedCurrent = Math.max(0, Math.min(current, clampedTotal));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {Array.from({ length: clampedTotal }).map((_, i) => {
          const isFilled = i < clampedCurrent;
          return (
            <span
              key={i}
              className={cn(
                "size-2 rounded-full transition-all",
                isFilled ? toneClasses[tone] : "bg-muted"
              )}
              aria-hidden="true"
            />
          );
        })}
        <span className="ml-1 text-xs tabular-nums text-muted-foreground">
          {clampedCurrent} / {clampedTotal}
        </span>
      </div>
    </div>
  );
}
