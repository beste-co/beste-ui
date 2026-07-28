"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stats5Props {
  label?: string;
  before?: string;
  after?: string;
  beforeCaption?: string;
  afterCaption?: string;
  className?: string;
}

export const stats5Demo: Stats5Props = {
  label: "Page load time",
  before: "3.4s",
  after: "0.8s",
  beforeCaption: "Before",
  afterCaption: "After",
};

export function Stats5({
  label,
  before = "0",
  after = "0",
  beforeCaption = "Before",
  afterCaption = "After",
  className,
}: Stats5Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-fit max-w-64 flex-col gap-2 rounded-lg border border-border bg-card px-3 py-3 shadow-sm">
        {label && (
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
        )}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">
              {beforeCaption}
            </span>
            <span className="text-xl font-semibold tabular-nums text-muted-foreground line-through">
              {before}
            </span>
          </div>
          <ArrowRight
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <div className="flex flex-col items-end">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {afterCaption}
            </span>
            <span className="text-xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
              {after}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
