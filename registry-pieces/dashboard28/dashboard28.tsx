"use client";

import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Dashboard28Row {
  name: string;
  plan: string;
  amount: string;
}

interface Dashboard28Props {
  title?: string;
  accountHeader?: string;
  planHeader?: string;
  amountHeader?: string;
  rows?: Dashboard28Row[];
  sortKey?: string;
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

export const dashboard28Demo: Dashboard28Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  title: "Recent invoices",
  accountHeader: "Account",
  planHeader: "Plan",
  amountHeader: "Amount",
  sortKey: "Amount",
  rows: [
    { name: "Atlas Labs", plan: "Scale", amount: "$820" },
    { name: "Northwind", plan: "Pro", amount: "$420" },
    { name: "Hemlock", plan: "Pro", amount: "$420" },
    { name: "Stoic & Co.", plan: "Starter", amount: "$120" },
  ],
};

export function Dashboard28({
  title = "Table",
  accountHeader = "Account",
  planHeader = "Plan",
  amountHeader = "Amount",
  rows = [],
  sortKey,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Dashboard28Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-1 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
            {title}
          </span>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-current/60">
              <th className="py-1 text-left font-medium">{accountHeader}</th>
              <th className="py-1 text-left font-medium">{planHeader}</th>
              <th className="py-1 text-right font-medium">
                <span className="inline-flex items-center gap-0.5">
                  {amountHeader}
                  {sortKey === amountHeader && (
                    <ArrowDown
                      className="size-3"
                      aria-hidden="true"
                    />
                  )}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={i}
                className="border-t border-current/15"
              >
                <td className="truncate py-1.5 pr-2">{r.name}</td>
                <td className="py-1.5 pr-2 text-current/60">{r.plan}</td>
                <td className="py-1.5 text-right font-mono tabular-nums">
                  {r.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
