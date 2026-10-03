"use client";

import { cn } from "@/lib/utils";

interface Food9Props {
  heading?: string;
  filters?: string[];
  active?: string[];
  bordered?: boolean;
  className?: string;
}

export const food9Demo: Food9Props = {
  heading: "Dietary preferences",
  filters: [
    "Vegetarian",
    "Vegan",
    "Gluten-free",
    "Nut-free",
  ],
  active: ["Vegetarian"],
  bordered: false,
};

export function Food9({
  heading,
  filters = [],
  active = [],
  bordered = false,
  className,
}: Food9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        {heading && (
          <span className="text-xs font-semibold text-muted-foreground">
            {heading}
          </span>
        )}
        <div className="flex flex-wrap gap-1.5">
          {filters.map((f, idx) => {
            const isActive = active.includes(f);
            return (
              <button
                key={idx}
                type="button"
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors",
                  isActive
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-border bg-card text-muted-foreground hover:bg-muted"
                )}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
