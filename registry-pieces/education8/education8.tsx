"use client";

import { PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Education8Props {
  eyebrow?: string;
  title?: string;
  remaining?: string;
  action?: string;
  bordered?: boolean;
  className?: string;
}

export const education8Demo: Education8Props = {
  title: "Memoizing expensive renders",
  remaining: "7 min left",
  action: "Resume",
  bordered: false,
};

export function Education8({
  eyebrow,
  title,
  remaining,
  action = "Resume",
  bordered = false,
  className,
}: Education8Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 items-center gap-3 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-3 shadow-sm", bordered && "border border-border")}>
        <PlayCircle className="size-6 shrink-0 text-primary" aria-hidden="true" />
        <div className="flex min-w-0 flex-1 flex-col">
          {eyebrow && (
            <span className="text-xs font-medium text-primary">
              {eyebrow}
            </span>
          )}
          {title && (
            <span className="truncate text-sm font-semibold text-card-foreground">
              {title}
            </span>
          )}
          {remaining && (
            <span className="truncate text-xs text-muted-foreground">
              {remaining}
            </span>
          )}
        </div>
        <button
          type="button"
          className="inline-flex shrink-0 items-center rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
        >
          {action}
        </button>
      </div>
    </div>
  );
}
