"use client";

import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "sunset" | "emerald" | "violet";

interface Progress14Props {
  level?: number;
  current?: number;
  next?: number;
  tone?: Tone;
  bordered?: boolean;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  sunset: "text-amber-500",
  emerald: "text-emerald-500",
  violet: "text-violet-500",
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
  tone: "primary",
  bordered: false,
};

export function Progress14({
  level = 1,
  current = 0,
  next = 100,
  tone = "primary",
  bordered = false,
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
      <div className={cn("flex w-full max-w-72 items-center gap-3 rounded-lg bg-card px-3 py-3 shadow-sm", bordered && "border border-border")}>
        <Trophy
          className={cn("size-6 shrink-0", iconClasses[tone])}
          aria-hidden="true"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-card-foreground">
              Level{" "}
              <span className="font-bold tabular-nums">{level}</span>
            </span>
            <span className="text-xs tabular-nums text-muted-foreground">
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
