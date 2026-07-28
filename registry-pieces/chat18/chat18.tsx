"use client";

import { cn } from "@/lib/utils";

interface Chat18Props {
  count?: number;
  className?: string;
}

export const chat18Demo: Chat18Props = {
  count: 3,
};

export function Chat18({ count = 1, className }: Chat18Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-center gap-3">
        <span
          className="h-px flex-1 bg-rose-500/60"
          aria-hidden="true"
        />
        <span className="rounded-full bg-rose-500 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-white">
          {count} unread
        </span>
        <span
          className="h-px flex-1 bg-rose-500/60"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
