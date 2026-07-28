"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface OperatorHint {
  token: string;
  label: string;
}

interface Search20Props {
  query?: string;
  operators?: OperatorHint[];
  className?: string;
}

export const search20Demo: Search20Props = {
  query: "is:open assignee:me label:",
  operators: [
    { token: "label:bug", label: "Bug reports" },
    { token: "label:polish", label: "Polish" },
    { token: "label:docs", label: "Documentation" },
  ],
};

export function Search20({
  query = "",
  operators = [],
  className,
}: Search20Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-sm">
          <Search
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="flex-1 truncate font-mono text-sm text-card-foreground">
            {query}
          </span>
          <SlidersHorizontal
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
        <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <span className="border-b border-border bg-muted/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Suggested operators
          </span>
          {operators.map((op, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-3 py-1.5 text-xs"
            >
              <span className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-card-foreground">
                {op.token}
              </span>
              <span className="truncate text-muted-foreground">
                {op.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
