"use client";

import { cn } from "@/lib/utils";

interface Browser7Props {
  tabs?: string[];
  activeIndex?: number;
  className?: string;
}

export const browser7Demo: Browser7Props = {
  tabs: ["Elements", "Console", "Sources", "Network", "Performance"],
  activeIndex: 3,
};

export function Browser7({
  tabs = [],
  activeIndex = 0,
  className,
}: Browser7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center overflow-x-auto rounded-md border border-border bg-card px-1 shadow-sm">
        {tabs.map((label, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={idx}
              type="button"
              className={cn(
                "relative shrink-0 px-3 py-2 font-mono text-xs transition-colors",
                isActive
                  ? "text-card-foreground"
                  : "text-muted-foreground hover:text-card-foreground"
              )}
            >
              {label}
              {isActive && (
                <span
                  className="absolute inset-x-1 -bottom-px h-0.5 rounded-full bg-primary"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
