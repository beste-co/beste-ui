"use client";

import { cn } from "@/lib/utils";

interface Shapes14Props {
  className?: string;
}

export const shapes14Demo: Shapes14Props = {};

export function Shapes14({ className }: Shapes14Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <svg
        viewBox="0 0 100 30"
        className="h-12 w-40 text-foreground"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M2 15 Q 17 0, 32 15 T 62 15 T 92 15" />
      </svg>
    </div>
  );
}
