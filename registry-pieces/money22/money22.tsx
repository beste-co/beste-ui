"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Money22Props {
  name?: string;
  badge?: string;
  price?: string;
  period?: string;
  items?: string[];
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

export const money22Demo: Money22Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Money22Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "w-full max-w-72 rounded-md p-5 shadow-xl",
          surfaceTone,
          bordered && "border border-current/15"
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium">{name}</p>
          {badge && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {badge}
            </span>
          )}
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-3xl font-semibold tracking-tight">
            {price}
          </span>
          {period && (
            <span className="text-sm text-current/60">/{period}</span>
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
                <span className="text-current/60">{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
