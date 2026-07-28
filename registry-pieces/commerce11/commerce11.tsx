"use client";

import { Check, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface Commerce11Props {
  code?: string;
  applied?: boolean;
  discount?: string;
  saved?: string;
  className?: string;
}

export const commerce11Demo: Commerce11Props = {
  code: "SUMMER20",
  applied: true,
  discount: "20% off",
  saved: "−$24.00",
};

export function Commerce11({
  code = "",
  applied = false,
  discount,
  saved,
  className,
}: Commerce11Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Promo code
        </span>
        <div className="flex items-center gap-1.5 overflow-hidden rounded-sm border border-border">
          <div className="flex flex-1 items-center gap-1.5 px-2.5">
            <Tag
              className="size-3 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="flex-1 truncate font-mono text-xs font-semibold tabular-nums text-card-foreground">
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
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
              <Check className="size-3" aria-hidden="true" />
              <span className="font-medium">
                {discount || "Discount"} applied
              </span>
            </div>
            {saved && (
              <span className="font-mono text-xs font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                {saved}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
