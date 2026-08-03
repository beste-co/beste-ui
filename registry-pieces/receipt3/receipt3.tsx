"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface DetailRow {
  label: string;
  value: string;
}

interface Receipt3Props {
  status?: string;
  amount?: string;
  caption?: string;
  rows?: DetailRow[];
  className?: string;
}

export const receipt3Demo: Receipt3Props = {
  status: "Payment received",
  amount: "$1,240.00",
  caption: "Bramble Health · May care plan",
  rows: [
    { label: "Method", value: "Visa ending 4417" },
    { label: "Reference", value: "SIR-4821" },
    { label: "Settled", value: "In 2 working days" },
  ],
};

export function Receipt3({ status, amount, caption, rows = [], className }: Receipt3Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="w-full max-w-72 rounded-md border border-border bg-card p-5 shadow-xl">
        <span
          className="flex size-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600"
          aria-hidden="true"
        >
          <Check className="size-4" />
        </span>

        {status && <p className="mt-3 text-sm text-muted-foreground">{status}</p>}
        {amount && (
          <p className="text-3xl font-semibold tracking-tight tabular-nums text-card-foreground">
            {amount}
          </p>
        )}
        {caption && <p className="mt-1 text-sm text-muted-foreground">{caption}</p>}

        {rows.length > 0 && (
          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-3">
            {rows.map((row, index) => (
              <div key={index} className="flex items-baseline justify-between gap-3">
                <span className="shrink-0 text-sm text-muted-foreground">{row.label}</span>
                <span className="truncate text-sm text-card-foreground">{row.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
