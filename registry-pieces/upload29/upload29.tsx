"use client";

import { HardDrive } from "lucide-react";

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
  bordered?: boolean;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  ocean: "text-indigo-500",
  sunset: "text-orange-500",
  violet: "text-violet-500",
  emerald: "text-emerald-500",
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
  tone: "primary",
  bordered: false,
};

export function Upload29({
  used,
  total,
  percent = 0,
  plan,
  tone = "ocean",
  bordered = false,
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
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <HardDrive
            className={cn("size-5 shrink-0", iconClasses[tone])}
            aria-hidden="true"
          />
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
          <span className="text-xs tabular-nums text-card-foreground">
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
        <div className="flex justify-end">
          <button
            type="button"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Free up space
          </button>
        </div>
      </div>
    </div>
  );
}
