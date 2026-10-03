"use client";

import { SearchX } from "lucide-react";
import { cn } from "@/lib/utils";

interface Search7Props {
  query?: string;
  suggestion?: string;
  tip?: string;
  bordered?: boolean;
  className?: string;
}

export const search7Demo: Search7Props = {
  query: "invioce",
  suggestion: "Did you mean invoice?",
  bordered: false,
};

export function Search7({
  query,
  suggestion,
  tip,
  bordered = false,
  className,
}: Search7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col items-center gap-2 rounded-xl bg-card px-4 py-5 text-center shadow-sm", bordered && "border border-border")}>
        <SearchX
          className="size-6 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        <span className="text-sm font-semibold text-card-foreground">
          No results for{" "}
          <span className="text-card-foreground">“{query}”</span>
        </span>
        {suggestion && (
          <button
            type="button"
            className="text-xs font-semibold text-sky-600 hover:underline dark:text-sky-400"
          >
            {suggestion}
          </button>
        )}
        {tip && (
          <span className="text-xs text-muted-foreground">{tip}</span>
        )}
      </div>
    </div>
  );
}
