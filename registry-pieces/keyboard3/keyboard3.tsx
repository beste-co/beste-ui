"use client";

import { Fragment } from "react";
import { cn } from "@/lib/utils";

interface Shortcut {
  label: string;
  keys: string[];
}

interface Keyboard3Props {
  title?: string;
  shortcuts?: Shortcut[];
  className?: string;
}

export const keyboard3Demo: Keyboard3Props = {
  title: "Keyboard shortcuts",
  shortcuts: [
    { label: "Open search", keys: ["⌘", "K"] },
    { label: "New file", keys: ["⌘", "N"] },
    { label: "Toggle sidebar", keys: ["⌘", "B"] },
    { label: "Switch workspace", keys: ["⌘", "⇧", "O"] },
  ],
};

export function Keyboard3({
  title = "Keyboard shortcuts",
  shortcuts = [],
  className,
}: Keyboard3Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-lg border border-border bg-card p-3 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </span>
        <div className="flex flex-col gap-1">
          {shortcuts.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-3 rounded-md px-1 py-1 text-sm"
            >
              <span className="truncate text-card-foreground">
                {item.label}
              </span>
              <div className="flex shrink-0 items-center gap-1">
                {item.keys.map((key, kIdx) => (
                  <Fragment key={kIdx}>
                    {kIdx > 0 && (
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
          ))}
        </div>
      </div>
    </div>
  );
}
