"use client";

import { cn } from "@/lib/utils";

interface Filter {
  label: string;
  count?: number;
}

interface Toolbar16Props {
  filters?: Filter[];
  active?: string;
  bordered?: boolean;
  className?: string;
}

export const toolbar16Demo: Toolbar16Props = {
  filters: [
    { label: "All" },
    { label: "Active" },
    { label: "Completed" },
    { label: "Archived" },
  ],
  active: "Active",
  bordered: false,
};

export function Toolbar16({
  filters = [],
  active,
  bordered = false,
  className,
}: Toolbar16Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("inline-flex items-center gap-1 rounded-full bg-card p-1 shadow-sm", bordered && "border border-border")}>
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
                    "tabular-nums",
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
