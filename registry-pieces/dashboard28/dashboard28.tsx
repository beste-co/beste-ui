"use client";

import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
  className?: string;
}

export const dashboard28Demo: Dashboard28Props = {
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
  className,
}: Dashboard28Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </span>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-muted-foreground">
              <th className="py-1 text-left font-medium">{accountHeader}</th>
              <th className="py-1 text-left font-medium">{planHeader}</th>
              <th className="py-1 text-right font-medium">
                <span className="inline-flex items-center gap-0.5">
                  {amountHeader}
                  {sortKey === amountHeader && (
                    <ArrowDown
                      className="size-3 text-card-foreground"
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
                className="border-t border-border text-card-foreground"
              >
                <td className="truncate py-1.5 pr-2">{r.name}</td>
                <td className="py-1.5 pr-2 text-muted-foreground">{r.plan}</td>
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
