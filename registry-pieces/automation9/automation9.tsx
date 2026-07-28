"use client";

import { Filter, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Automation9Filter {
  field: string;
  op: string;
  value: string;
}

interface Automation9Props {
  match?: "all" | "any";
  filters?: Automation9Filter[];
  headerLabel?: string;
  addFilterLabel?: string;
  className?: string;
}

export const automation9Demo: Automation9Props = {
  match: "all",
  headerLabel: "Only run if",
  addFilterLabel: "Add filter",
  filters: [
    { field: "status", op: "is", value: '"paid"' },
    { field: "amount", op: ">", value: "100" },
    { field: "currency", op: "is", value: '"USD"' },
  ],
};

export function Automation9({
  match = "all",
  filters = [],
  headerLabel = "Only run if",
  addFilterLabel = "Add filter",
  className,
}: Automation9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Filter
              className="size-3.5 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {headerLabel}
            </span>
          </div>
          <div className="inline-flex overflow-hidden rounded-sm border border-border text-xs">
            <span
              className={cn(
                "px-1.5 py-0.5",
                match === "all"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground"
              )}
            >
              all
            </span>
            <span
              className={cn(
                "px-1.5 py-0.5",
                match === "any"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground"
              )}
            >
              any
            </span>
          </div>
        </div>
        <ul className="flex flex-col gap-1">
          {filters.map((f, i) => (
            <li
              key={i}
              className="flex items-center gap-1 rounded-sm border border-border bg-muted/40 px-2 py-1 font-mono text-xs"
            >
              <span className="font-semibold text-card-foreground">
                {f.field}
              </span>
              <span className="text-muted-foreground">{f.op}</span>
              <span className="text-sky-600 dark:text-sky-400">{f.value}</span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="inline-flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <Plus className="size-3" aria-hidden="true" />
          {addFilterLabel}
        </button>
      </div>
    </div>
  );
}
