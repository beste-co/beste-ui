"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface DetailRow {
  label: string;
  value: string;
}

interface Receipt3Props {
  status?: string;
  amount?: string;
  caption?: string;
  rows?: DetailRow[];
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const receipt3Demo: Receipt3Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  status: "Payment received",
  amount: "$1,240.00",
  caption: "Bramble Health · May care plan",
  rows: [
    { label: "Method", value: "Visa ending 4417" },
    { label: "Reference", value: "SIR-4821" },
    { label: "Settled", value: "In 2 working days" },
  ],
};

export function Receipt3({ status, amount, caption, rows = [], surface = "card", bordered = true, inverted = false, className }: Receipt3Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className={cn("w-full max-w-72 rounded-md p-5 shadow-xl", surfaceTone, bordered && "border border-current/15")}>
        <span
          className="flex size-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600"
          aria-hidden="true"
        >
          <Check className="size-4" />
        </span>

        {status && <p className="mt-3 text-sm text-current/60">{status}</p>}
        {amount && (
          <p className="text-3xl font-semibold tracking-tight tabular-nums">
            {amount}
          </p>
        )}
        {caption && <p className="mt-1 text-sm text-current/60">{caption}</p>}

        {rows.length > 0 && (
          <div className="mt-4 flex flex-col gap-2 border-t border-current/15 pt-3">
            {rows.map((row, index) => (
              <div key={index} className="flex items-baseline justify-between gap-3">
                <span className="shrink-0 text-sm text-current/60">{row.label}</span>
                <span className="truncate text-sm">{row.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
