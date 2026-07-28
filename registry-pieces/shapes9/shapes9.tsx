"use client";

import { cn } from "@/lib/utils";

interface Shapes9Props {
  className?: string;
}

export const shapes9Demo: Shapes9Props = {};

export function Shapes9({ className }: Shapes9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <svg
        viewBox="0 0 40 40"
        className="size-20"
        aria-hidden="true"
        fill="none"
        strokeWidth="6"
      >
        <circle cx="20" cy="20" r="14" stroke="currentColor" className="text-muted" />
        <circle
          cx="20"
          cy="20"
          r="14"
          stroke="currentColor"
          strokeDasharray="22 88"
          strokeLinecap="round"
          transform="rotate(-90 20 20)"
          className="text-foreground"
        />
      </svg>
    </div>
  );
}
