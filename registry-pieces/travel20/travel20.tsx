"use client";

import { Luggage } from "lucide-react";
import { cn } from "@/lib/utils";

interface BaggageItem {
  label: string;
  weight: string;
  count: number;
  included?: boolean;
}

interface Travel20Props {
  passenger?: string;
  items?: BaggageItem[];
  limit?: string;
  bordered?: boolean;
  className?: string;
}

export const travel20Demo: Travel20Props = {
  passenger: "Ólafur Arnalds",
  items: [
    { label: "Cabin bag", weight: "8 kg", count: 1, included: true },
    { label: "Checked suitcase", weight: "23 kg", count: 2 },
    { label: "Personal item", weight: "2 kg", count: 1, included: true },
  ],
  bordered: false,
};

export function Travel20({
  passenger,
  items = [],
  limit,
  bordered = false,
  className,
}: Travel20Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <Luggage className="size-5 shrink-0 text-violet-500" aria-hidden="true" />
          {passenger && (
            <span className="truncate text-xs font-semibold text-muted-foreground">
              {passenger}
            </span>
          )}
        </div>
        <div className="flex flex-col divide-y divide-border">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-2 py-1.5 text-xs"
            >
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="font-medium text-card-foreground">
                  {item.label}
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {item.weight} · {item.count} {item.count === 1 ? "piece" : "pieces"}
                </span>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold",
                  item.included
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                    : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                )}
              >
                {item.included ? "Included" : "Paid"}
              </span>
            </div>
          ))}
        </div>
        {limit && (
          <span className="border-t border-border pt-2 text-xs text-muted-foreground">
            {limit}
          </span>
        )}
      </div>
    </div>
  );
}
