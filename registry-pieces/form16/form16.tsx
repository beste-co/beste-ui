"use client";

import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Form16Props {
  label?: string;
  selected?: string[];
  placeholder?: string;
  className?: string;
}

export const form16Demo: Form16Props = {
  label: "Project labels",
  selected: ["Design", "Polish", "Good first issue"],
  placeholder: "Add label",
};

export function Form16({
  label,
  selected = [],
  placeholder = "Add label",
  className,
}: Form16Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-card-foreground">
            {label}
          </label>
        )}
        <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-md border border-border bg-card py-1.5 pl-2 pr-1 shadow-sm">
          {selected.map((chip, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 rounded-full bg-violet-500/15 py-0.5 pl-2 pr-1 text-xs font-medium text-violet-700 dark:text-violet-300"
            >
              {chip}
              <button
                type="button"
                className="flex size-4 items-center justify-center rounded-full hover:bg-violet-500/20"
                aria-label={`Remove ${chip}`}
              >
                <X className="size-3" aria-hidden="true" />
              </button>
            </span>
          ))}
          <span className="flex-1 px-1 text-xs text-muted-foreground">
            {placeholder}
          </span>
          <button
            type="button"
            className="flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted"
            aria-label="Open options"
          >
            <ChevronDown className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
