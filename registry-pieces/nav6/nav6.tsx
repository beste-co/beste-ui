"use client";

import { cn } from "@/lib/utils";

interface Nav6Props {
  tabs?: string[];
  activeIndex?: number;
  className?: string;
}

export const nav6Demo: Nav6Props = {
  tabs: ["General", "Billing", "Team", "API"],
  activeIndex: 0,
};

export function Nav6({
  tabs = [],
  activeIndex = 0,
  className,
}: Nav6Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex items-end border-b border-border">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            type="button"
            className={cn(
              "-mb-px rounded-t-md border border-transparent px-3 py-1.5 text-sm transition-colors",
              idx === activeIndex
                ? "border-border border-b-card bg-card font-semibold text-card-foreground"
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
