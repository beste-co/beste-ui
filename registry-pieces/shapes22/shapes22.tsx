"use client";

import { cn } from "@/lib/utils";

const INTENSITY: Record<number, string> = {
  0: "bg-muted",
  1: "bg-emerald-200",
  2: "bg-emerald-400",
  3: "bg-emerald-600",
};

const CELLS = [
  1, 0, 2, 1, 3, 0, 1,
  0, 2, 1, 0, 2, 3, 1,
  1, 3, 2, 1, 0, 1, 2,
  2, 1, 0, 3, 1, 2, 0,
  0, 1, 3, 2, 1, 0, 2,
];

interface Shapes22Props {
  className?: string;
}

export const shapes22Demo: Shapes22Props = {};

export function Shapes22({ className }: Shapes22Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="grid grid-cols-7 gap-1" aria-hidden="true">
        {CELLS.map((level, i) => (
          <span
            key={i}
            className={cn("size-2.5 rounded-sm", INTENSITY[level])}
          />
        ))}
      </div>
    </div>
  );
}
