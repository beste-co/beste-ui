"use client";

import { cn } from "@/lib/utils";

interface LineItem {
  label: string;
  amount: string;
}

interface Receipt2Props {
  title?: string;
  reference?: string;
  status?: string;
  items?: LineItem[];
  total?: string;
  className?: string;
}

export const receipt2Demo: Receipt2Props = {
  title: "Invoice",
  reference: "#4821",
  status: "Paid",
  items: [
    { label: "Care plan · May", amount: "$980.00" },
    { label: "Lab processing", amount: "$180.00" },
    { label: "Platform fee", amount: "$80.00" },
  ],
  total: "$1,240.00",
};

export function Receipt2({
  title = "Invoice",
  reference,
  status,
  items = [],
  total,
  className,
}: Receipt2Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-80 rounded-md border border-border bg-card p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <p className="text-base font-semibold text-card-foreground">
              {title}
            </p>
            {reference && (
              <span className="font-mono text-sm text-muted-foreground">
                {reference}
              </span>
            )}
          </div>
          {status && (
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
              {status}
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-mono tabular-nums text-card-foreground">
                {item.amount}
              </span>
            </div>
          ))}
        </div>

        {total && (
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <span className="text-sm font-medium text-card-foreground">Total</span>
            <span className="font-mono text-base font-semibold tabular-nums text-card-foreground">
              {total}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
