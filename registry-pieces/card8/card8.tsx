"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Card8Props {
  name?: string;
  price?: string;
  period?: string;
  features?: string[];
  featured?: boolean;
  className?: string;
}

export const card8Demo: Card8Props = {
  name: "Studio",
  price: "$39",
  period: "per month",
  features: ["Unlimited blocks", "Team workspaces", "Priority support"],
  featured: true,
};

export function Card8({
  name = "Plan",
  price = "$0",
  period = "per month",
  features = [],
  featured = false,
  className,
}: Card8Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full max-w-60 flex-col gap-3 rounded-xl border p-4 shadow-sm",
          featured
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-card"
        )}
      >
        <div className="flex flex-col gap-0.5">
          <span
            className={cn(
              "text-sm font-semibold uppercase tracking-wide",
              featured ? "text-primary-foreground/80" : "text-muted-foreground"
            )}
          >
            {name}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span
              className={cn(
                "text-3xl font-bold tabular-nums",
                featured ? "text-primary-foreground" : "text-card-foreground"
              )}
            >
              {price}
            </span>
            <span
              className={cn(
                "text-xs",
                featured ? "text-primary-foreground/70" : "text-muted-foreground"
              )}
            >
              {period}
            </span>
          </div>
        </div>
        <ul className="flex flex-col gap-1.5">
          {features.map((feature, i) => (
            <li
              key={i}
              className={cn(
                "flex items-center gap-2 text-xs",
                featured ? "text-primary-foreground/90" : "text-card-foreground"
              )}
            >
              <Check className="size-3 shrink-0" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
