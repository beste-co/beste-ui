"use client";

import { cn } from "@/lib/utils";

interface Toolbar14Props {
  sizes?: string[];
  active?: string;
  bordered?: boolean;
  className?: string;
}

export const toolbar14Demo: Toolbar14Props = {
  sizes: ["XS", "S", "M", "L", "XL"],
  active: "M",
  bordered: false,
};

export function Toolbar14({
  sizes = ["S", "M", "L"],
  active,
  bordered = false,
  className,
}: Toolbar14Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("inline-flex items-center gap-1 rounded-md bg-card p-1 shadow-sm", bordered && "border border-border")}>
        {sizes.map((s) => {
          const isActive = s === active;
          return (
            <button
              key={s}
              type="button"
              aria-pressed={isActive}
              className={cn(
                "flex size-8 items-center justify-center rounded text-xs font-semibold transition-colors",
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
