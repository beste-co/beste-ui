"use client";

import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

interface Food9Props {
  heading?: string;
  filters?: string[];
  active?: string[];
  className?: string;
}

export const food9Demo: Food9Props = {
  heading: "Dietary preferences",
  filters: [
    "Vegetarian",
    "Vegan",
    "Gluten-free",
    "Lactose-free",
    "Keto",
    "Halal",
    "Kosher",
    "Nut-free",
  ],
  active: ["Vegetarian", "Gluten-free"],
};

export function Food9({
  heading,
  filters = [],
  active = [],
  className,
}: Food9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Leaf className="size-3.5 text-emerald-500" aria-hidden="true" />
          {heading && (
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {heading}
            </span>
          )}
        </div>
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
