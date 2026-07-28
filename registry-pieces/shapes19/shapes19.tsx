"use client";

import { cn } from "@/lib/utils";

interface Shapes19Props {
  className?: string;
}

export const shapes19Demo: Shapes19Props = {};

export function Shapes19({ className }: Shapes19Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className="size-16 text-amber-500"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polygon points="14,2 4,14 11,14 10,22 20,10 13,10" />
      </svg>
    </div>
  );
}
