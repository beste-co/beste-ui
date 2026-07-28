"use client";

import { ArchiveRestore, HardDrive } from "lucide-react";

import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "ocean"
  | "sunset"
  | "violet"
  | "emerald";

interface Upload29Props {
  used?: string;
  total?: string;
  percent?: number;
  plan?: string;
  tone?: Tone;
  className?: string;
}

const tileClasses: Record<Tone, string> = {
  primary: "bg-primary/15 text-primary",
  foreground: "bg-foreground/15 text-foreground",
  ocean: "bg-indigo-500/15 text-indigo-500",
  sunset: "bg-orange-500/15 text-orange-500",
  violet: "bg-violet-500/15 text-violet-500",
  emerald: "bg-emerald-500/15 text-emerald-500",
};

const barClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  ocean: "bg-gradient-to-r from-indigo-500 to-fuchsia-500",
  sunset: "bg-gradient-to-r from-orange-500 to-rose-500",
  violet: "bg-gradient-to-r from-violet-500 to-fuchsia-500",
  emerald: "bg-gradient-to-r from-emerald-500 to-teal-500",
};

export const upload29Demo: Upload29Props = {
  used: "184.2 GB",
  total: "250 GB",
  percent: 74,
  plan: "Growth plan · shared with team",
  tone: "primary",
};

export function Upload29({
  used,
  total,
  percent = 0,
  plan,
  tone = "ocean",
  className,
}: Upload29Props) {
  const pct = Math.max(0, Math.min(100, percent));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-md",
              tileClasses[tone]
            )}
          >
            <HardDrive className="size-4" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-sm font-semibold text-card-foreground">
              Storage
            </span>
            {plan && (
              <span className="truncate text-xs text-muted-foreground">
                {plan}
              </span>
            )}
          </div>
          <span className="font-mono text-xs text-card-foreground">
            {used} / {total}
          </span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-muted"
          aria-hidden="true"
        >
          <div
            className={cn("h-full rounded-full", barClasses[tone])}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{pct}% used</span>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <ArchiveRestore className="size-3" aria-hidden="true" />
            Free up space
          </button>
        </div>
      </div>
    </div>
  );
}
