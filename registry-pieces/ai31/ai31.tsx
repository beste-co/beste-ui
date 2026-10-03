"use client";

import { Database } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber";

interface Ai31Props {
  name?: string;
  rows?: number;
  size?: string;
  split?: { train: number; val: number; test: number };
  tone?: Tone;
  bordered?: boolean;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  violet: "text-violet-600 dark:text-violet-400",
  emerald: "text-emerald-600 dark:text-emerald-400",
  sky: "text-sky-600 dark:text-sky-400",
  amber: "text-amber-600 dark:text-amber-400",
};

const trainBar: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  amber: "bg-amber-500",
};

export const ai31Demo: Ai31Props = {
  name: "support_tickets",
  rows: 48200,
  split: { train: 80, val: 10, test: 10 },
  tone: "primary",
  bordered: false,
};

export function Ai31({
  name = "dataset",
  rows = 0,
  size,
  split = { train: 80, val: 10, test: 10 },
  tone = "primary",
  bordered = false,
  className,
}: Ai31Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <Database className={cn("size-4 shrink-0", iconClasses[tone])} aria-hidden="true" />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-xs font-semibold text-card-foreground">
              {name}
            </span>
            <span className="text-xs text-muted-foreground">
              {rows.toLocaleString()} rows{size ? ` · ${size}` : ""}
            </span>
          </div>
        </div>
        <div className="flex h-1.5 w-full overflow-hidden rounded-full">
          <span
            className={trainBar[tone]}
            style={{ width: `${split.train}%` }}
            aria-hidden="true"
          />
          <span
            className="bg-muted-foreground/50"
            style={{ width: `${split.val}%` }}
            aria-hidden="true"
          />
          <span
            className="bg-muted"
            style={{ width: `${split.test}%` }}
            aria-hidden="true"
          />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>train {split.train}%</span>
          <span>val {split.val}%</span>
          <span>test {split.test}%</span>
        </div>
      </div>
    </div>
  );
}
