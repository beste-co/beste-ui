"use client";

import { cn } from "@/lib/utils";

interface Form24Props {
  label?: string;
  options?: string[];
  activeIndex?: number;
  className?: string;
}

export const form24Demo: Form24Props = {
  label: "View mode",
  options: ["Kanban", "List", "Calendar", "Timeline"],
  activeIndex: 1,
};

export function Form24({
  label,
  options = [],
  activeIndex = 0,
  className,
}: Form24Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-muted-foreground">
            {label}
          </label>
        )}
        <div className="inline-flex items-center gap-0.5 rounded-lg bg-muted p-1 shadow-inner">
          {options.map((opt, idx) => (
            <button
              key={idx}
              type="button"
              className={cn(
                "rounded-md px-3 py-1 text-xs font-semibold transition-colors",
                idx === activeIndex
                  ? "bg-card text-card-foreground shadow-sm"
                  : "text-muted-foreground hover:text-card-foreground"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
