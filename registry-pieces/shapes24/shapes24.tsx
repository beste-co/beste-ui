"use client";

import { cn } from "@/lib/utils";

interface Shapes24Props {
  className?: string;
}

export const shapes24Demo: Shapes24Props = {};

export function Shapes24({ className }: Shapes24Props) {
  const selectedRow = 1;
  const selectedCol = 3;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex flex-col gap-1.5" aria-hidden="true">
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <span key={i} className="h-1 rounded-full bg-muted-foreground/40" />
          ))}
        </div>
        {Array.from({ length: 4 }).map((_, row) => (
          <div key={row} className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, col) => {
              const isSelected = row === selectedRow && col === selectedCol;
              return (
                <span
                  key={col}
                  className={cn(
                    "size-3 rounded-sm",
                    isSelected ? "bg-foreground" : "bg-muted"
                  )}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
