"use client";

import { cn } from "@/lib/utils";

interface StatCell {
  value: string;
  label: string;
}

interface Stats8Props {
  cells?: StatCell[];
  className?: string;
}

export const stats8Demo: Stats8Props = {
  cells: [
    { value: "$48K", label: "Revenue" },
    { value: "2,340", label: "Orders" },
    { value: "12.4%", label: "Conversion" },
    { value: "6:42", label: "Avg session" },
  ],
};

export function Stats8({ cells = [], className }: Stats8Props) {
  const grid = cells.slice(0, 4);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="grid w-full max-w-72 grid-cols-2 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        {grid.map((cell, i) => (
          <div
            key={i}
            className={cn(
              "flex flex-col gap-0.5 px-3 py-2.5",
              i % 2 === 0 && "border-r border-border",
              i < 2 && "border-b border-border"
            )}
          >
            <span className="text-lg font-bold tabular-nums leading-none text-card-foreground">
              {cell.value}
            </span>
            <span className="text-xs text-muted-foreground">
              {cell.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
