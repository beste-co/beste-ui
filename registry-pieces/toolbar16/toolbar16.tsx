"use client";

import { cn } from "@/lib/utils";

interface Filter {
  label: string;
  count?: number;
}

interface Toolbar16Props {
  filters?: Filter[];
  active?: string;
  className?: string;
}

export const toolbar16Demo: Toolbar16Props = {
  filters: [
    { label: "All", count: 42 },
    { label: "Active", count: 18 },
    { label: "Completed", count: 22 },
    { label: "Archived", count: 2 },
  ],
  active: "Active",
};

export function Toolbar16({
  filters = [],
  active,
  className,
}: Toolbar16Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-sm">
        {filters.map((f) => {
          const isActive = f.label === active;
          return (
            <button
              key={f.label}
              type="button"
              aria-pressed={isActive}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                isActive
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-card-foreground"
              )}
            >
              {f.label}
              {typeof f.count === "number" && (
                <span
                  className={cn(
                    "font-mono tabular-nums",
                    isActive
                      ? "text-background/70"
                      : "text-muted-foreground/70"
                  )}
                >
                  {f.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
