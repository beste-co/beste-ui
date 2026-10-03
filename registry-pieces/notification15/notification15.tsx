"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "sky" | "emerald" | "violet";

interface Notification15Props {
  label?: string;
  filename?: string;
  percent?: number;
  tone?: Tone;
  bordered?: boolean;
  className?: string;
}

const barClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  sky: "bg-sky-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
};

const textClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-600 dark:text-sky-400",
  emerald: "text-emerald-600 dark:text-emerald-400",
  violet: "text-violet-600 dark:text-violet-400",
};

export const notification15Demo: Notification15Props = {
  label: "Uploading",
  filename: "product-hero-final.mp4",
  percent: 64,
  tone: "primary",
  bordered: false,
};

export function Notification15({
  label = "Uploading",
  filename,
  percent = 0,
  tone = "primary",
  bordered = false,
  className,
}: Notification15Props) {
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-lg bg-card p-3 shadow-lg", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <Loader2
            className={cn("size-4 animate-spin", textClasses[tone])}
            aria-hidden="true"
          />
          <span className="text-sm font-semibold text-card-foreground">
            {label}
          </span>
          <span className="ml-auto text-xs tabular-nums text-muted-foreground">
            {clamped}%
          </span>
        </div>
        {filename && (
          <span className="truncate text-xs text-muted-foreground">
            {filename}
          </span>
        )}
        <div
          className="h-1.5 overflow-hidden rounded-full bg-muted"
          aria-hidden="true"
        >
          <div
            className={cn(
              "h-full rounded-full transition-[width] duration-500",
              barClasses[tone]
            )}
            style={{ width: `${clamped}%` }}
          />
        </div>
      </div>
    </div>
  );
}
