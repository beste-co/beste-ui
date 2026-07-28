"use client";

import { ArrowDownToLine } from "lucide-react";
import { cn } from "@/lib/utils";

interface Editor36Props {
  value?: string;
  total?: number;
  className?: string;
}

export const editor36Demo: Editor36Props = {
  value: "142",
  total: 386,
};

export function Editor36({
  value = "",
  total = 0,
  className,
}: Editor36Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-center gap-2 rounded-md border border-border bg-card px-3 py-2 shadow-md">
        <ArrowDownToLine
          className="size-3.5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        <div className="flex flex-1 items-center gap-0.5">
          <span className="text-xs text-muted-foreground">Go to line</span>
          <span
            className="font-mono text-sm font-semibold tabular-nums text-card-foreground"
          >
            {value}
          </span>
          <span
            className="ml-0.5 h-4 w-px animate-pulse bg-foreground"
            aria-hidden="true"
          />
        </div>
        <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
          of {total}
        </span>
      </div>
    </div>
  );
}
