"use client";

import { cn } from "@/lib/utils";

interface Nav11Tab {
  label: string;
  count?: number;
}

interface Nav11Props {
  tabs?: Nav11Tab[];
  activeIndex?: number;
  className?: string;
}

export const nav11Demo: Nav11Props = {
  tabs: [
    { label: "Inbox", count: 12 },
    { label: "Assigned", count: 4 },
    { label: "Mentions" },
    { label: "Archive" },
  ],
  activeIndex: 0,
};

export function Nav11({
  tabs = [],
  activeIndex = 0,
  className,
}: Nav11Props) {
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
              "relative inline-flex items-center gap-1.5 px-1 pb-2 text-sm transition-colors",
              idx === activeIndex
                ? "font-semibold text-card-foreground"
                : "text-muted-foreground hover:text-card-foreground"
            )}
          >
            {tab.label}
            {typeof tab.count === "number" && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-xs font-semibold",
                  idx === activeIndex
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {tab.count}
              </span>
            )}
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
