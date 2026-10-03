"use client";

import { cn } from "@/lib/utils";

interface Risk {
  label: string;
  level: "low" | "medium" | "high";
  note?: string;
}

interface Legal25Props {
  matter?: string;
  overall?: "low" | "medium" | "high";
  risks?: Risk[];
  bordered?: boolean;
  className?: string;
}

const levelConfig = {
  low: {
    pill: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    label: "Low",
  },
  medium: {
    pill: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    label: "Medium",
  },
  high: {
    pill: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
    label: "High",
  },
};

export const legal25Demo: Legal25Props = {
  matter: "M&A risk assessment",
  risks: [
    {
      label: "Regulatory filings timing",
      level: "high",
    },
    {
      label: "IP assignment coverage",
      level: "medium",
    },
    {
      label: "Customer consent triggers",
      level: "low",
    },
  ],
  bordered: false,
};

export function Legal25({
  matter,
  overall,
  risks = [],
  bordered = false,
  className,
}: Legal25Props) {
  const o = overall ? levelConfig[overall] : undefined;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        {(matter || o) && (
          <div className="flex items-center justify-between gap-2">
            {matter && (
              <span className="text-xs font-semibold text-muted-foreground">
                {matter}
              </span>
            )}
            {o && (
              <span className={cn("ml-auto shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold", o.pill)}>
                {o.label} overall
              </span>
            )}
          </div>
        )}
        <div className="flex flex-col divide-y divide-border">
          {risks.map((r, idx) => {
            const c = levelConfig[r.level];
            return (
              <div
                key={idx}
                className="flex items-center justify-between gap-2 py-1.5 text-xs"
              >
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-medium text-card-foreground">
                    {r.label}
                  </span>
                  {r.note && (
                    <span className="truncate text-xs text-muted-foreground">
                      {r.note}
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 font-semibold",
                    c.pill
                  )}
                >
                  {c.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
