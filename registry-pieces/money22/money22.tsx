"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Money22Props {
  name?: string;
  badge?: string;
  price?: string;
  period?: string;
  items?: string[];
  className?: string;
}

export const money22Demo: Money22Props = {
  name: "Practice",
  badge: "Popular",
  price: "$79",
  period: "mo",
  items: ["Unlimited members", "Automated billing", "Priority support"],
};

export function Money22({
  name = "Plan",
  badge,
  price = "—",
  period,
  items = [],
  className,
}: Money22Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-72 rounded-md border border-border bg-card p-5 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-card-foreground">{name}</p>
          {badge && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {badge}
            </span>
          )}
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-3xl font-semibold tracking-tight text-card-foreground">
            {price}
          </span>
          {period && (
            <span className="text-sm text-muted-foreground">/{period}</span>
          )}
        </div>
        {items.length > 0 && (
          <div className="mt-3 flex flex-col gap-1.5">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Check
                  className="size-3.5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span className="text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
