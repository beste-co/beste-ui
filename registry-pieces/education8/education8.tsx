"use client";

import { ArrowRight, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Education8Props {
  eyebrow?: string;
  title?: string;
  remaining?: string;
  action?: string;
  className?: string;
}

export const education8Demo: Education8Props = {
  eyebrow: "Continue learning",
  title: "Memoizing expensive renders",
  remaining: "7 min left · Chapter 4",
  action: "Resume",
};

export function Education8({
  eyebrow,
  title,
  remaining,
  action = "Resume",
  className,
}: Education8Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-3 rounded-xl border border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-3 shadow-sm">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <PlayCircle className="size-5" aria-hidden="true" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          {eyebrow && (
            <span className="text-xs font-medium uppercase tracking-wide text-primary">
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
          className="inline-flex shrink-0 items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
        >
          {action}
          <ArrowRight className="size-3" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
