"use client";

import { cn } from "@/lib/utils";

interface Nav5Props {
  tabs?: string[];
  activeIndex?: number;
  className?: string;
}

export const nav5Demo: Nav5Props = {
  tabs: ["Day", "Week", "Month", "Year"],
  activeIndex: 2,
};

export function Nav5({
  tabs = [],
  activeIndex = 0,
  className,
}: Nav5Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-1 rounded-full bg-muted p-1 shadow-inner">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            type="button"
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
              idx === activeIndex
                ? "bg-card text-card-foreground shadow-sm"
                : "text-muted-foreground hover:text-card-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
