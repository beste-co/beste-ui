"use client";

import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "success";

interface Progress3Props {
  value?: number;
  label?: string;
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  success: "bg-emerald-500",
};

export const progress3Demo: Progress3Props = {
  value: 68,
  label: "Deployment",
  tone: "success",
};

export function Progress3({
  value = 0,
  label,
  tone = "primary",
  className,
}: Progress3Props) {
  const pct = Math.max(0, Math.min(100, value));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-64 flex-col gap-1.5">
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-sm font-medium text-card-foreground">
              {label}
            </span>
          )}
          <span className="text-sm font-semibold tabular-nums text-muted-foreground">
            {pct}%
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              toneClasses[tone]
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
