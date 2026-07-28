"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tab {
  label: string;
  count?: number;
}

interface Search13Props {
  query?: string;
  tabs?: Tab[];
  activeIndex?: number;
  className?: string;
}

export const search13Demo: Search13Props = {
  query: "onboarding",
  tabs: [
    { label: "All", count: 48 },
    { label: "Pages", count: 22 },
    { label: "Files", count: 14 },
    { label: "People", count: 12 },
  ],
  activeIndex: 1,
};

export function Search13({
  query = "",
  tabs = [],
  activeIndex = 0,
  className,
}: Search13Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-md">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <Search
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="flex-1 truncate text-sm text-card-foreground">
            {query}
          </span>
        </div>
        <div className="flex items-center gap-1 border-b border-border px-2 pt-2">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              type="button"
              className={cn(
                "relative inline-flex items-center gap-1.5 rounded-t-md px-3 py-2 text-xs font-medium",
                idx === activeIndex
                  ? "text-card-foreground"
                  : "text-muted-foreground hover:text-card-foreground"
              )}
            >
              {tab.label}
              {typeof tab.count === "number" && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-xs",
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
                  className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary"
                  aria-hidden="true"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
