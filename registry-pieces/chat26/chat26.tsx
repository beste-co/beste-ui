"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Chat26Props {
  before?: string;
  match?: string;
  after?: string;
  author?: string;
  time?: string;
  className?: string;
}

export const chat26Demo: Chat26Props = {
  before: "Let me know what you think about the new ",
  match: "onboarding",
  after: " flow we pushed yesterday.",
  author: "Ayşe",
  time: "Yesterday · 15:22",
};

export function Chat26({
  before,
  match = "",
  after,
  author,
  time,
  className,
}: Chat26Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <button
        type="button"
        className="flex w-full max-w-80 items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 text-left shadow-sm transition-colors hover:bg-muted"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-baseline justify-between gap-2">
            <span className="truncate text-sm font-semibold text-card-foreground">
              {author}
            </span>
            {time && (
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {time}
              </span>
            )}
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {before}
            <mark className="rounded bg-amber-200 px-0.5 font-semibold text-amber-900 dark:bg-amber-900 dark:text-amber-100">
              {match}
            </mark>
            {after}
          </p>
        </div>
        <ArrowRight
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
