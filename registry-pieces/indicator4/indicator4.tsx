"use client";

import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "emerald" | "amber" | "rose";

interface Indicator4Props {
  level?: number;
  charging?: boolean;
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

export const indicator4Demo: Indicator4Props = {
  level: 42,
  charging: true,
  tone: "emerald",
};

export function Indicator4({
  level = 0,
  charging = false,
  tone = "emerald",
  className,
}: Indicator4Props) {
  const pct = Math.max(0, Math.min(100, level));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-sm">
        <div className="relative flex items-center">
          <div
            className="relative flex h-4 w-8 items-center rounded-sm border-2 border-card-foreground/80 p-0.5"
            aria-hidden="true"
          >
            <div
              className={cn("h-full rounded-sm transition-all", toneClasses[tone])}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div
            className="h-2 w-0.5 rounded-r-sm bg-card-foreground/80"
            aria-hidden="true"
          />
        </div>
        <span className="text-sm font-semibold tabular-nums text-card-foreground">
          {pct}%
        </span>
        {charging && (
          <Zap
            className="size-3.5 fill-card-foreground text-card-foreground"
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
