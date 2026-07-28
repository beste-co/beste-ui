"use client";

import { cn } from "@/lib/utils";

interface FunctionKey {
  key: string;
  action?: string;
}

interface Keyboard10Props {
  keys?: FunctionKey[];
  className?: string;
}

export const keyboard10Demo: Keyboard10Props = {
  keys: [
    { key: "F1", action: "Help" },
    { key: "F2", action: "Rename" },
    { key: "F3", action: "Find next" },
    { key: "F4", action: "Close" },
    { key: "F5", action: "Reload" },
  ],
};

export function Keyboard10({ keys = [], className }: Keyboard10Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex gap-1.5 rounded-lg border border-border bg-card p-2 shadow-sm">
        {keys.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1">
            <kbd className="flex h-8 min-w-10 items-center justify-center rounded-md border border-border border-b-2 bg-muted px-2 font-mono text-xs font-medium text-card-foreground">
              {item.key}
            </kbd>
            {item.action && (
              <span className="text-xs text-muted-foreground">
                {item.action}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
