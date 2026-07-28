"use client";

import { cn } from "@/lib/utils";

interface Toolbar14Props {
  sizes?: string[];
  active?: string;
  className?: string;
}

export const toolbar14Demo: Toolbar14Props = {
  sizes: ["XS", "S", "M", "L", "XL"],
  active: "M",
};

export function Toolbar14({
  sizes = ["S", "M", "L"],
  active,
  className,
}: Toolbar14Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-1 rounded-md border border-border bg-card p-1 shadow-sm">
        {sizes.map((s) => {
          const isActive = s === active;
          return (
            <button
              key={s}
              type="button"
              aria-pressed={isActive}
              className={cn(
                "flex size-8 items-center justify-center rounded font-mono text-xs font-semibold transition-colors",
                isActive
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-card-foreground"
              )}
            >
              {s}
            </button>
          );
        })}
      </div>
    </div>
  );
}
