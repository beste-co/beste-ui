"use client";

import { Fragment } from "react";
import { cn } from "@/lib/utils";

interface Tooltip2Props {
  label?: string;
  keys?: string[];
  className?: string;
}

export const tooltip2Demo: Tooltip2Props = {
  label: "Duplicate row",
  keys: ["⌘", "D"],
};

export function Tooltip2({
  label = "Tooltip",
  keys = [],
  className,
}: Tooltip2Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="relative">
        <div className="inline-flex items-center gap-2 rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background shadow-md">
          <span>{label}</span>
          {keys.length > 0 && (
            <span className="flex items-center gap-0.5">
              {keys.map((key, idx) => (
                <Fragment key={idx}>
                  <kbd className="inline-flex h-4 min-w-4 items-center justify-center rounded-sm bg-background/15 px-1 font-mono text-xs text-background/80">
                    {key}
                  </kbd>
                </Fragment>
              ))}
            </span>
          )}
        </div>
        <div
          className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-foreground"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
