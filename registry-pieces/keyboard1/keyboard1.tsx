"use client";

import { Fragment } from "react";
import { cn } from "@/lib/utils";

interface Keyboard1Props {
  keys?: string[];
  label?: string;
  className?: string;
}

export const keyboard1Demo: Keyboard1Props = {
  keys: ["⌘", "K"],
  label: "Quick search",
};

export function Keyboard1({
  keys = ["⌘", "K"],
  label,
  className,
}: Keyboard1Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2 shadow-sm">
        {label && (
          <span className="text-xs font-medium text-muted-foreground">
            {label}
          </span>
        )}
        <div className="flex items-center gap-1">
          {keys.map((key, index) => (
            <Fragment key={index}>
              {index > 0 && (
                <span
                  className="text-xs text-muted-foreground/60"
                  aria-hidden="true"
                >
                  +
                </span>
              )}
              <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-border border-b-2 bg-muted px-1.5 font-mono text-xs font-medium text-card-foreground">
                {key}
              </kbd>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
