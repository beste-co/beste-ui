"use client";

import { cn } from "@/lib/utils";

interface Input2Props {
  digits?: string[];
  total?: number;
  className?: string;
}

export const input2Demo: Input2Props = {
  digits: ["4", "2", "7", "", "", ""],
  total: 6,
};

export function Input2({
  digits = [],
  total = 6,
  className,
}: Input2Props) {
  const cells = Array.from({ length: total }, (_, i) => digits[i] ?? "");
  const cursorIndex = cells.findIndex((c) => c === "");

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex items-center gap-1.5">
        {cells.map((digit, i) => {
          const isCursor = i === cursorIndex;
          const isFilled = digit !== "";
          return (
            <div
              key={i}
              className={cn(
                "flex size-9 items-center justify-center rounded-md font-mono text-base font-semibold tabular-nums shadow-sm",
                isFilled && "border border-border bg-card text-card-foreground",
                !isFilled &&
                  !isCursor &&
                  "border border-border bg-muted text-muted-foreground",
                isCursor && "border-2 border-primary bg-card text-card-foreground"
              )}
            >
              {digit || (isCursor && (
                <span
                  className="h-4 w-px animate-pulse bg-primary"
                  aria-hidden="true"
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
