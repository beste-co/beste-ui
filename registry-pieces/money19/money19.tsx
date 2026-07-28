"use client";

import { cn } from "@/lib/utils";

interface Category {
  label: string;
  amount: string;
  pct: number;
}

interface Money19Props {
  title?: string;
  categories?: Category[];
  className?: string;
}

export const money19Demo: Money19Props = {
  title: "Top spending",
  categories: [
    { label: "Rent", amount: "$1,800", pct: 100 },
    { label: "Groceries", amount: "$640", pct: 36 },
    { label: "Transport", amount: "$220", pct: 12 },
    { label: "Leisure", amount: "$410", pct: 23 },
  ],
};

export function Money19({ title, categories = [], className }: Money19Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-3 rounded-lg border border-border bg-card px-4 py-3.5 shadow-sm">
        {title && (
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {title}
          </span>
        )}
        <div className="flex flex-col gap-2.5">
          {categories.map((category, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-card-foreground">{category.label}</span>
                <span className="font-medium tabular-nums text-card-foreground">
                  {category.amount}
                </span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-foreground"
                  style={{ width: `${Math.max(0, Math.min(100, category.pct))}%` }}
                  aria-hidden="true"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
