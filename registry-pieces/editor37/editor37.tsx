"use client";

import { Fragment } from "react";
import { cn } from "@/lib/utils";

interface Key {
  action: string;
  keys: string[];
}

interface Editor37Props {
  title?: string;
  bindings?: Key[];
  className?: string;
}

export const editor37Demo: Editor37Props = {
  title: "Keybindings",
  bindings: [
    { action: "Command palette", keys: ["⌘", "K"] },
    { action: "Quick open", keys: ["⌘", "P"] },
    { action: "Toggle terminal", keys: ["⌃", "`"] },
    { action: "Format document", keys: ["⌥", "⇧", "F"] },
  ],
};

export function Editor37({
  title = "Keybindings",
  bindings = [],
  className,
}: Editor37Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm">
        <div className="border-b border-border px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </div>
        <ul className="flex flex-col divide-y divide-border">
          {bindings.map((b, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-3 px-3 py-1.5 text-xs"
            >
              <span className="truncate text-card-foreground">
                {b.action}
              </span>
              <div className="flex items-center gap-0.5">
                {b.keys.map((k, j) => (
                  <Fragment key={j}>
                    {j > 0 && (
                      <span className="text-xs text-muted-foreground/60">
                        +
                      </span>
                    )}
                    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-border border-b-2 bg-muted px-1 font-mono text-xs font-medium text-card-foreground">
                      {k}
                    </kbd>
                  </Fragment>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
