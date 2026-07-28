"use client";

import { cn } from "@/lib/utils";

interface Progress12Props {
  lines?: number;
  withAvatar?: boolean;
  className?: string;
}

export const progress12Demo: Progress12Props = {
  lines: 3,
  withAvatar: true,
};

export function Progress12({
  lines = 3,
  withAvatar = false,
  className,
}: Progress12Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-start gap-3 rounded-lg border border-border bg-card p-3 shadow-sm">
        {withAvatar && (
          <span
            className="size-10 shrink-0 animate-pulse rounded-full bg-muted"
            aria-hidden="true"
          />
        )}
        <div className="flex flex-1 flex-col gap-2 pt-1">
          {Array.from({ length: Math.max(1, lines) }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-2 animate-pulse rounded-full bg-muted",
                i === 0 && "w-3/4",
                i === 1 && "w-full",
                i === 2 && "w-2/3",
                i >= 3 && "w-5/6"
              )}
              style={{ animationDelay: `${i * 120}ms` }}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
