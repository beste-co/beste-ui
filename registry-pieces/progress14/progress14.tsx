"use client";

import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "sunset" | "emerald" | "violet";

interface Progress14Props {
  level?: number;
  current?: number;
  next?: number;
  tone?: Tone;
  className?: string;
}

const tileClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sunset:
    "bg-gradient-to-br from-amber-400 to-orange-500 text-white",
  emerald:
    "bg-gradient-to-br from-emerald-400 to-teal-500 text-white",
  violet:
    "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white",
};

const barClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  sunset: "bg-gradient-to-r from-amber-400 to-orange-500",
  emerald: "bg-gradient-to-r from-emerald-400 to-teal-500",
  violet: "bg-gradient-to-r from-violet-500 to-fuchsia-500",
};

export const progress14Demo: Progress14Props = {
  level: 12,
  current: 1840,
  next: 2500,
  tone: "emerald",
};

export function Progress14({
  level = 1,
  current = 0,
  next = 100,
  tone = "emerald",
  className,
}: Progress14Props) {
  const pct =
    next > 0 ? Math.max(0, Math.min(100, (current / next) * 100)) : 0;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-center gap-3 rounded-lg border border-border bg-card px-3 py-3 shadow-sm">
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-lg shadow-sm",
            tileClasses[tone]
          )}
          aria-hidden="true"
        >
          <Trophy className="size-5" aria-hidden="true" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-card-foreground">
              Level{" "}
              <span className="font-bold tabular-nums">{level}</span>
            </span>
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              {current} / {next} XP
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                barClasses[tone]
              )}
              style={{ width: `${pct}%` }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
