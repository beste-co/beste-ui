"use client";

import { cn } from "@/lib/utils";

interface Nav4Props {
  tabs?: string[];
  activeIndex?: number;
  className?: string;
}

export const nav4Demo: Nav4Props = {
  tabs: ["Overview", "Analytics", "Audience", "Settings"],
  activeIndex: 1,
};

export function Nav4({
  tabs = [],
  activeIndex = 0,
  className,
}: Nav4Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-4 border-b border-border">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            type="button"
            className={cn(
              "relative px-1 pb-2 text-sm transition-colors",
              idx === activeIndex
                ? "font-semibold text-card-foreground"
                : "text-muted-foreground hover:text-card-foreground"
            )}
          >
            {tab}
            {idx === activeIndex && (
              <span
                className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary"
                aria-hidden="true"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
