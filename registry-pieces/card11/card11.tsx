"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Card11Props {
  name?: string;
  price?: string;
  period?: string;
  tagline?: string;
  features?: string[];
  action?: string;
  className?: string;
}

export const card11Demo: Card11Props = {
  name: "Starter",
  price: "$12",
  period: "/ mo",
  tagline: "Everything a small team needs to ship.",
  features: [
    "Up to 5 editors",
    "25 GB asset storage",
    "Weekly analytics email",
    "Community support",
  ],
  action: "Choose Starter",
};

export function Card11({
  name,
  price,
  period = "/ mo",
  tagline,
  features = [],
  action,
  className,
}: Card11Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-64 flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-1">
          {name && (
            <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {name}
            </span>
          )}
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-3xl font-bold text-card-foreground">
              {price}
            </span>
            <span className="text-sm text-muted-foreground">{period}</span>
          </div>
          {tagline && (
            <span className="text-xs text-muted-foreground">{tagline}</span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          {features.map((f, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs">
              <Check
                className="mt-0.5 size-3.5 shrink-0 text-emerald-500"
                aria-hidden="true"
              />
              <span className="text-card-foreground">{f}</span>
            </div>
          ))}
        </div>
        {action && (
          <button
            type="button"
            className="rounded-md border border-border bg-background px-3 py-2 text-xs font-semibold text-card-foreground shadow-sm hover:bg-muted"
          >
            {action}
          </button>
        )}
      </div>
    </div>
  );
}
