"use client";

import { AlertTriangle, ShieldCheck } from "lucide-react";
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
  overall: "medium",
  risks: [
    {
      label: "Regulatory filings timing",
      level: "high",
      note: "CFIUS window closes May 30",
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
};

export function Legal25({
  matter,
  overall = "low",
  risks = [],
  className,
}: Legal25Props) {
  const o = levelConfig[overall];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-indigo-500/15 text-indigo-500">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
            </div>
            {matter && (
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {matter}
              </span>
            )}
          </div>
          <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", o.pill)}>
            {o.label} overall
          </span>
        </div>
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
                    <span className="inline-flex items-center gap-1 truncate text-xs text-muted-foreground">
                      <AlertTriangle
                        className="size-3 text-amber-500"
                        aria-hidden="true"
                      />
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
