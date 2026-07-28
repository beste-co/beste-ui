"use client";

import { Fragment } from "react";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface Keyboard2Props {
  action?: string;
  hint?: string;
  keys?: string[];
  className?: string;
}

export const keyboard2Demo: Keyboard2Props = {
  action: "Go to file",
  hint: "Jump to any file in the workspace",
  keys: ["⌘", "P"],
};

export function Keyboard2({
  action,
  hint,
  keys = [],
  className,
}: Keyboard2Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-3 rounded-lg border border-border bg-card p-2.5 shadow-sm">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <FileText className="size-4" aria-hidden="true" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          {action && (
            <span className="truncate text-sm font-medium text-card-foreground">
              {action}
            </span>
          )}
          {hint && (
            <span className="truncate text-xs text-muted-foreground">
              {hint}
            </span>
          )}
        </div>
        {keys.length > 0 && (
          <div className="flex shrink-0 items-center gap-1">
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
                <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-border border-b-2 bg-background px-1.5 font-mono text-xs font-medium text-muted-foreground">
                  {key}
                </kbd>
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
