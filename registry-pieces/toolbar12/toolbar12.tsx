"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Direction = "asc" | "desc";

interface Toolbar12Props {
  field?: string;
  fields?: string[];
  direction?: Direction;
  className?: string;
}

export const toolbar12Demo: Toolbar12Props = {
  field: "Date",
  fields: ["Name", "Date", "Size"],
  direction: "desc",
};

export function Toolbar12({
  field = "Name",
  fields = ["Name"],
  direction = "asc",
  className,
}: Toolbar12Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-1 py-0.5 shadow-sm">
        <span className="px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Sort
        </span>
        <div className="h-5 w-px bg-border" aria-hidden="true" />
        <div className="flex items-center gap-0.5">
          {fields.map((f) => {
            const isActive = f === field;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={isActive}
                className={cn(
                  "rounded px-2 py-1 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-muted text-card-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-card-foreground"
                )}
              >
                {f}
              </button>
            );
          })}
        </div>
        <div className="h-5 w-px bg-border" aria-hidden="true" />
        <button
          type="button"
          aria-label={direction === "asc" ? "Ascending" : "Descending"}
          className="flex size-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
        >
          {direction === "asc" ? (
            <ArrowUp className="size-3.5" aria-hidden="true" />
          ) : (
            <ArrowDown className="size-3.5" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
