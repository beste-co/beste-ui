"use client";

import { Fragment } from "react";
import { cn } from "@/lib/utils";

interface Keyboard11Props {
  prefix?: string;
  keys?: string[];
  suffix?: string;
  bordered?: boolean;
  className?: string;
}

export const keyboard11Demo: Keyboard11Props = {
  prefix: "Press",
  keys: ["⌘", "K"],
  suffix: "to open search",
  bordered: false,
};

export function Keyboard11({
  prefix = "Press",
  keys = [],
  suffix,
  bordered = false,
  className,
}: Keyboard11Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground shadow-sm", bordered && "border border-border")}>
        <span>{prefix}</span>
        <span className="inline-flex items-center gap-1">
          {keys.map((key, idx) => (
            <Fragment key={idx}>
              {idx > 0 && (
                <span className="text-muted-foreground/60" aria-hidden="true">
                  +
                </span>
              )}
              <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-border border-b-2 bg-card px-1.5 text-xs font-semibold text-card-foreground">
                {key}
              </kbd>
            </Fragment>
          ))}
        </span>
        {suffix && <span>{suffix}</span>}
      </div>
    </div>
  );
}
