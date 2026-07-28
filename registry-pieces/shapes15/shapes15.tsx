"use client";

import { cn } from "@/lib/utils";

interface Shapes15Props {
  className?: string;
}

export const shapes15Demo: Shapes15Props = {};

export function Shapes15({ className }: Shapes15Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className="size-16 text-foreground"
        fill="currentColor"
        aria-hidden="true"
      >
        <rect x="9" y="2" width="6" height="20" rx="1" />
        <rect x="2" y="9" width="20" height="6" rx="1" />
      </svg>
    </div>
  );
}
