"use client";

import { Focus } from "lucide-react";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

interface Editor32Props {
  filename?: string;
  shortcut?: string[];
  className?: string;
}

export const editor32Demo: Editor32Props = {
  filename: "manifesto.md",
};

export function Editor32({
  filename = "file",
  shortcut = [],
  className,
}: Editor32Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col items-center gap-3 rounded-lg text-center">
        <Focus className="size-5 text-muted-foreground" aria-hidden="true" />
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-card-foreground">
            Zen Mode
          </span>
          <span className="text-xs text-muted-foreground">
            {filename}
          </span>
        </div>
        {shortcut.length > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">Exit</span>
            {shortcut.map((k, i) => (
              <Fragment key={i}>
                {i > 0 && (
                  <span className="text-xs text-muted-foreground/60">+</span>
                )}
                <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-border border-b-2 bg-muted px-1 text-xs font-medium">
                  {k}
                </kbd>
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
