"use client";

import { cn } from "@/lib/utils";

interface Shapes13Props {
  className?: string;
}

export const shapes13Demo: Shapes13Props = {};

export function Shapes13({ className }: Shapes13Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <svg
        viewBox="0 0 80 50"
        className="h-20 w-32 text-foreground"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="32" y="4" width="16" height="14" rx="2" fill="currentColor" />
        <rect x="8" y="32" width="16" height="14" rx="2" />
        <rect x="56" y="32" width="16" height="14" rx="2" />
        <path d="M40 18 L40 25 L16 25 L16 32" />
        <path d="M40 25 L64 25 L64 32" />
      </svg>
    </div>
  );
}
