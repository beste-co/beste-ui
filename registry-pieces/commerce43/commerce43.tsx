"use client";

import { cn } from "@/lib/utils";

interface Commerce43Props {
  /** The green pill in the corner */
  status?: string;
  /** A quiet word opposite the pill */
  meta?: string;
  amount?: string;
  /** What was bought, under the amount */
  caption?: string;
  /** Ruled rows, a quiet label and a value */
  rows?: { label: string; value: string }[];
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const commerce43Demo: Commerce43Props = {
  status: "Paid on Stripe",
  amount: "$180.00",
  caption: "Field Jacket",
  rows: [
    { label: "Checkout", value: "Your Stripe payment link" },
    { label: "Paid to", value: "Your Stripe account" },
  ],
  framed: true,
};

export function Commerce43({ status, meta, amount, caption, rows = [], framed = true, fill = false, className }: Commerce43Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-90",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-3.5 rounded-2xl bg-card p-4.5 text-sm text-card-foreground", !framed && "shadow-lg", fill && "justify-center")}>
          <div className="flex items-center justify-between gap-3 text-xs">
            {status && <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">{status}</span>}
            {meta && <span className="text-muted-foreground">{meta}</span>}
          </div>
          <div>
            {amount && <div className="text-3xl font-medium tracking-tight">{amount}</div>}
            {caption && <div className="mt-1 text-muted-foreground">{caption}</div>}
          </div>
          {rows.length > 0 && (
            <div className="flex flex-col">
              {rows.map((row, index) => (
                <div key={index} className="flex justify-between gap-3 border-t border-border py-2.5">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="text-right">{row.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
