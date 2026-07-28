"use client";

import { Bell, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber"
  | "rose";

interface Commerce27Props {
  name?: string;
  releaseDate?: string;
  badge?: string;
  price?: string;
  notified?: number;
  tone?: Tone;
  className?: string;
}

const ctaClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  violet: "bg-violet-500 text-white",
  emerald: "bg-emerald-500 text-white",
  sky: "bg-sky-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
};

const badgeClasses: Record<Tone, string> = {
  primary: "bg-primary/15 text-primary",
  foreground: "bg-foreground/10 text-foreground",
  violet: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  emerald: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  sky: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  amber: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  rose: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
};

export const commerce27Demo: Commerce27Props = {
  name: "Air Max 90 Limited Edition",
  releaseDate: "Ships May 15",
  badge: "Pre-order",
  price: "$159",
  notified: 1284,
  tone: "primary",
};

export function Commerce27({
  name = "Product",
  releaseDate = "Coming soon",
  badge = "Pre-order",
  price,
  notified,
  tone = "primary",
  className,
}: Commerce27Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide",
              badgeClasses[tone]
            )}
          >
            {badge}
          </span>
          {typeof notified === "number" && (
            <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
              <Bell className="size-3" aria-hidden="true" />
              {notified.toLocaleString()} notified
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-card-foreground">
            {name}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarClock className="size-3" aria-hidden="true" />
            {releaseDate}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          {price && (
            <span className="font-mono text-base font-semibold tabular-nums text-card-foreground">
              {price}
            </span>
          )}
          <button
            type="button"
            className={cn(
              "ml-auto rounded-sm px-3 py-1.5 text-xs font-semibold",
              ctaClasses[tone]
            )}
          >
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
}
