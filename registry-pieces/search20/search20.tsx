"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface OperatorHint {
  token: string;
  label: string;
}

interface Search20Props {
  query?: string;
  operators?: OperatorHint[];
  bordered?: boolean;
  className?: string;
}

export const search20Demo: Search20Props = {
  query: "is:open assignee:me label:",
  operators: [
    { token: "label:bug", label: "Bug reports" },
    { token: "label:polish", label: "Polish" },
    { token: "label:docs", label: "Documentation" },
  ],
  bordered: false,
};

export function Search20({
  query = "",
  operators = [],
  bordered = false,
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
        <div className={cn("flex items-center gap-2 rounded-lg bg-card px-3 py-2 shadow-sm", bordered && "border border-border")}>
          <Search
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="flex-1 truncate text-sm text-card-foreground">
            {query}
          </span>
        </div>
        <div className={cn("flex flex-col overflow-hidden rounded-lg bg-card py-1 shadow-sm", bordered && "border border-border")}>
          {operators.map((op, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-3 py-1.5 text-xs"
            >
              <span className={cn("rounded bg-muted px-1.5 py-0.5 text-xs text-card-foreground", bordered && "border border-border")}>
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
