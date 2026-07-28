"use client";

import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tooltip3Props {
  title?: string;
  description?: string;
  className?: string;
}

export const tooltip3Demo: Tooltip3Props = {
  title: "Monthly recurring revenue",
  description:
    "Sum of normalized subscriptions divided by months, excluding one-time charges.",
};

export function Tooltip3({
  title,
  description,
  className,
}: Tooltip3Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="relative">
        <div className="flex w-64 items-start gap-2.5 rounded-lg border border-border bg-card p-3 shadow-lg">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <Info className="size-3.5" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            {title && (
              <span className="text-xs font-semibold text-card-foreground">
                {title}
              </span>
            )}
            {description && (
              <span className="text-xs leading-snug text-muted-foreground">
                {description}
              </span>
            )}
          </div>
        </div>
        <div
          className="absolute -top-1 left-6 size-2 rotate-45 border-l border-t border-border bg-card"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
