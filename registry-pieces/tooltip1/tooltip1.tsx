"use client";

import { cn } from "@/lib/utils";

type Direction = "top" | "bottom";

interface Tooltip1Props {
  label?: string;
  direction?: Direction;
  className?: string;
}

export const tooltip1Demo: Tooltip1Props = {
  label: "Pin to favorites",
  direction: "top",
};

export function Tooltip1({
  label = "Tooltip",
  direction = "top",
  className,
}: Tooltip1Props) {
  const isTop = direction === "top";

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="relative">
        <div className="rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background shadow-md">
          {label}
        </div>
        <div
          className={cn(
            "absolute left-1/2 size-2 -translate-x-1/2 rotate-45 bg-foreground",
            isTop ? "-bottom-1" : "-top-1"
          )}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
