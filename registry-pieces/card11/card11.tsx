"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Card11Props {
  name?: string;
  price?: string;
  period?: string;
  tagline?: string;
  features?: string[];
  action?: string;
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

export const card11Demo: Card11Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Card11Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-64 flex-col gap-3 rounded-xl p-4 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex flex-col gap-1">
          {name && (
            <span className="text-sm font-semibold uppercase tracking-wide text-current/60">
              {name}
            </span>
          )}
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-3xl font-bold">
              {price}
            </span>
            <span className="text-sm text-current/60">{period}</span>
          </div>
          {tagline && (
            <span className="text-xs text-current/60">{tagline}</span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          {features.map((f, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs">
              <Check
                className="mt-0.5 size-3.5 shrink-0 text-emerald-500"
                aria-hidden="true"
              />
              <span className="">{f}</span>
            </div>
          ))}
        </div>
        {action && (
          <button
            type="button"
            className="rounded-md border border-current/15 bg-background px-3 py-2 text-xs font-semibold shadow-sm hover:bg-current/10 text-foreground"
          >
            {action}
          </button>
        )}
      </div>
    </div>
  );
}
