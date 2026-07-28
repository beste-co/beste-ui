"use client";

import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface Media24Props {
  title?: string;
  subtitle?: string;
  progress?: number;
  current?: string;
  duration?: string;
  className?: string;
}

const BARS = [
  0.35, 0.6, 0.45, 0.8, 0.55, 0.7, 0.4, 0.9, 0.5, 0.65, 0.3, 0.75, 0.5, 0.85,
  0.45, 0.6, 0.35, 0.7, 0.55, 0.8, 0.4, 0.6, 0.45, 0.5,
];

export const media24Demo: Media24Props = {
  title: "Running a calmer front desk",
  subtitle: "The Sirius Podcast · Ep. 12",
  progress: 0.4,
  current: "12:04",
  duration: "31:20",
};

export function Media24({
  title,
  subtitle,
  progress = 0,
  current,
  duration,
  className,
}: Media24Props) {
  const played = Math.max(0, Math.min(progress, 1)) * BARS.length;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-80 rounded-md border border-border bg-card p-4 shadow-xl">
        <div className="flex items-center gap-3">
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
            aria-hidden="true"
          >
            <Play className="size-5 fill-current" />
          </span>
          <div className="min-w-0 flex-1">
            {title && (
              <p className="truncate text-sm font-semibold text-card-foreground">
                {title}
              </p>
            )}
            {subtitle && (
              <p className="truncate text-sm text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex h-8 items-center gap-0.5" aria-hidden="true">
          {BARS.map((height, index) => (
            <span
              key={index}
              className={cn(
                "flex-1 rounded-full",
                index < played ? "bg-primary" : "bg-muted"
              )}
              style={{ height: `${height * 100}%` }}
            />
          ))}
        </div>

        {(current || duration) && (
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{current}</span>
            <span>{duration}</span>
          </div>
        )}
      </div>
    </div>
  );
}
