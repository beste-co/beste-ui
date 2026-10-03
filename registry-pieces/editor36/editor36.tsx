"use client";

import { cn } from "@/lib/utils";

interface Editor36Props {
  value?: string;
  total?: number;
  bordered?: boolean;
  className?: string;
}

export const editor36Demo: Editor36Props = {
  value: "142",
  total: 386,
  bordered: false,
};

export function Editor36({
  value = "",
  total = 0,
  bordered = false,
  className,
}: Editor36Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 items-center gap-2 rounded-md bg-card px-3 py-2 shadow-md", bordered && "border border-border")}>
        <div className="flex flex-1 items-center gap-0.5">
          <span className="text-xs text-muted-foreground">Go to line</span>
          <span
            className="text-sm font-semibold tabular-nums text-card-foreground"
          >
            {value}
          </span>
          <span
            className="ml-0.5 h-4 w-px animate-pulse bg-foreground"
            aria-hidden="true"
          />
        </div>
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
          of {total}
        </span>
      </div>
    </div>
  );
}
