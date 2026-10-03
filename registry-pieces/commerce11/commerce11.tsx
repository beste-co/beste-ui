"use client";

import { cn } from "@/lib/utils";

interface Commerce11Props {
  code?: string;
  applied?: boolean;
  discount?: string;
  saved?: string;
  bordered?: boolean;
  className?: string;
}

export const commerce11Demo: Commerce11Props = {
  code: "SUMMER20",
  applied: true,
  discount: "20% off",
  saved: "−$24.00",
  bordered: false,
};

export function Commerce11({
  code = "",
  applied = false,
  discount,
  saved,
  bordered = false,
  className,
}: Commerce11Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className={cn("flex items-center gap-1.5 overflow-hidden rounded-sm", bordered ? "border border-border" : "bg-muted")}>
          <div className="flex flex-1 items-center px-2.5">
            <span className="flex-1 truncate text-xs font-semibold tabular-nums text-card-foreground">
              {code || "Enter code"}
            </span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 text-xs font-semibold text-card-foreground hover:bg-muted"
          >
            Apply
          </button>
        </div>
        {applied && (
          <div className="flex items-center justify-between gap-2 rounded-sm bg-emerald-500/10 px-2 py-1.5">
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {discount || "Discount"} applied
            </span>
            {saved && (
              <span className="text-xs font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                {saved}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
