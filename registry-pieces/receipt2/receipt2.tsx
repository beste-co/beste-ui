"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

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

export const receipt2Demo: Receipt2Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Receipt2Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("w-full max-w-80 rounded-md p-5 shadow-xl", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <p className="text-base font-semibold">
              {title}
            </p>
            {reference && (
              <span className="font-mono text-sm text-current/60">
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

        <div className="mt-4 flex flex-col gap-2 border-t border-current/15 pt-4">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-current/60">{item.label}</span>
              <span className="font-mono tabular-nums">
                {item.amount}
              </span>
            </div>
          ))}
        </div>

        {total && (
          <div className="mt-3 flex items-center justify-between border-t border-current/15 pt-3">
            <span className="text-sm font-medium">Total</span>
            <span className="font-mono text-base font-semibold tabular-nums">
              {total}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
