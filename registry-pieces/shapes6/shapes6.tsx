"use client";

import { cn } from "@/lib/utils";

interface Shapes6Props {
  className?: string;
}

export const shapes6Demo: Shapes6Props = {};

export function Shapes6({ className }: Shapes6Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <svg
        viewBox="0 0 90 50"
        className="h-20 w-40 text-foreground"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <line x1="8" y1="6" x2="8" y2="44" />
        <line x1="8" y1="44" x2="84" y2="44" />
        <circle cx="22" cy="36" r="2.5" fill="currentColor" />
        <circle cx="34" cy="26" r="2.5" fill="currentColor" opacity="0.4" />
        <circle cx="46" cy="32" r="2.5" fill="currentColor" opacity="0.7" />
        <circle cx="60" cy="14" r="2.5" fill="currentColor" />
        <circle cx="72" cy="22" r="2.5" fill="currentColor" opacity="0.4" />
      </svg>
    </div>
  );
}
