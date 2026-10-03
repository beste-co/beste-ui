"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Editor38Props {
  openLine?: string;
  closeLine?: string;
  collapsed?: number;
  bordered?: boolean;
  className?: string;
}

export const editor38Demo: Editor38Props = {
  openLine: "function renderChart(data) {",
  closeLine: "}",
  collapsed: 24,
  bordered: false,
};

export function Editor38({
  openLine = "",
  closeLine = "",
  collapsed = 0,
  bordered = false,
  className,
}: Editor38Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <pre className={cn("flex w-full max-w-80 flex-col gap-0.5 rounded-md bg-card px-3 py-2 text-xs leading-relaxed shadow-sm", bordered && "border border-border")}>
        <div className="flex items-baseline gap-2">
          <span className="w-4 shrink-0 text-right tabular-nums text-muted-foreground/60">
            12
          </span>
          <ChevronDown
            className="size-3 shrink-0 translate-y-0.5 text-muted-foreground"
            aria-hidden="true"
          />
          <code className="flex-1 break-words text-card-foreground">
            {openLine}
          </code>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded bg-muted px-2 py-1 text-left transition-colors hover:bg-muted/70"
        >
          <span className="w-4 shrink-0 text-right tabular-nums text-muted-foreground/60">
            13
          </span>
          <ChevronRight
            className="size-3 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="flex-1 italic text-muted-foreground">
            … {collapsed} lines folded
          </span>
        </button>
        <div className="flex items-baseline gap-2">
          <span className="w-4 shrink-0 text-right tabular-nums text-muted-foreground/60">
            {37 + (collapsed > 99 ? 0 : 0)}
          </span>
          <span className="size-3 shrink-0" aria-hidden="true" />
          <code className="flex-1 break-words text-card-foreground">
            {closeLine}
          </code>
        </div>
      </pre>
    </div>
  );
}
