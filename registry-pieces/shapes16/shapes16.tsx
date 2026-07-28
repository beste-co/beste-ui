"use client";

import { cn } from "@/lib/utils";

interface Shapes16Props {
  className?: string;
}

export const shapes16Demo: Shapes16Props = {};

export function Shapes16({ className }: Shapes16Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-48 items-center gap-3 rounded-md border border-border bg-card p-3 shadow-sm"
        aria-hidden="true"
      >
        <div className="flex flex-col gap-1.5">
          <span className="h-1 w-10 rounded-full bg-muted" />
          <span className="h-3 w-14 rounded-sm bg-foreground" />
          <div className="flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span className="h-1 w-8 rounded-full bg-muted" />
          </div>
        </div>
        <svg
          viewBox="0 0 60 30"
          className="ml-auto h-10 w-16 text-emerald-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="2,25 10,18 18,22 26,15 34,18 42,8 50,12 58,5" />
        </svg>
      </div>
    </div>
  );
}
