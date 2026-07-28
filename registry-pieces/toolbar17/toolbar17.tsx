"use client";

import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "emerald"
  | "violet"
  | "sky"
  | "rose";

interface Toolbar17Props {
  current?: number;
  total?: number;
  tone?: Tone;
  className?: string;
}

const fillClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  sky: "bg-sky-500",
  rose: "bg-rose-500",
};

const btnClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  emerald: "bg-emerald-500 text-white",
  violet: "bg-violet-500 text-white",
  sky: "bg-sky-500 text-white",
  rose: "bg-rose-500 text-white",
};

export const toolbar17Demo: Toolbar17Props = {
  current: 42,
  total: 135,
  tone: "foreground",
};

function fmt(s: number): string {
  const mm = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${mm.toString().padStart(2, "0")}:${ss
    .toString()
    .padStart(2, "0")}`;
}

export function Toolbar17({
  current = 42,
  total = 135,
  tone = "foreground",
  className,
}: Toolbar17Props) {
  const pct =
    total > 0
      ? Math.max(0, Math.min(100, (current / total) * 100))
      : 0;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-3 rounded-full border border-border bg-card px-2 py-1.5 shadow-sm">
        <button
          type="button"
          aria-label="Play"
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-full shadow-sm",
            btnClasses[tone]
          )}
        >
          <Play
            className="size-3 fill-current"
            aria-hidden="true"
          />
        </button>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {fmt(current)}
        </span>
        <div className="relative flex-1">
          <div
            className="h-1 rounded-full bg-muted"
            aria-hidden="true"
          >
            <div
              className={cn("h-full rounded-full", fillClasses[tone])}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span
            className={cn(
              "absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-card",
              fillClasses[tone]
            )}
            style={{ left: `${pct}%` }}
            aria-hidden="true"
          />
        </div>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {fmt(total)}
        </span>
      </div>
    </div>
  );
}
