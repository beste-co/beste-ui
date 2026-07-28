"use client";

import { cn } from "@/lib/utils";

interface Chat14Props {
  label?: string;
  className?: string;
}

export const chat14Demo: Chat14Props = {
  label: "Yesterday",
};

export function Chat14({
  label = "Today",
  className,
}: Chat14Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-center gap-3">
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
      </div>
    </div>
  );
}
