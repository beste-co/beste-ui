"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Progress16Props {
  title?: string;
  steps?: string[];
  activeIndex?: number;
  caption?: string;
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

export const progress16Demo: Progress16Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  title: "Migration",
  steps: ["Export", "Map fields", "Review", "Go live"],
  activeIndex: 2,
  caption: "Review finishes today, go live is scheduled for Friday.",
};

export function Progress16({
  title,
  steps = [],
  activeIndex = 0,
  caption,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Progress16Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className={cn("w-full max-w-96 rounded-md p-5 shadow-xl", surfaceTone, bordered && "border border-current/15")}>
        {title && <p className="text-base font-semibold">{title}</p>}

        <div className="mt-4 flex items-start">
          {steps.map((step, index) => {
            const done = index < activeIndex;
            const active = index === activeIndex;

            return (
              <div key={index} className="flex min-w-0 flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  <span
                    className={cn(
                      "h-px flex-1",
                      index === 0 ? "bg-transparent" : done || active ? "bg-primary" : "bg-border"
                    )}
                    aria-hidden="true"
                  />
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium tabular-nums",
                      done && "bg-primary text-primary-foreground",
                      active && "border-2 border-primary bg-current/10 text-primary",
                      !done && !active && "border border-current/15 bg-current/10 text-current/60"
                    )}
                  >
                    {done ? <Check className="size-3" aria-hidden="true" /> : index + 1}
                  </span>
                  <span
                    className={cn(
                      "h-px flex-1",
                      index === steps.length - 1 ? "bg-transparent" : done ? "bg-primary" : "bg-border"
                    )}
                    aria-hidden="true"
                  />
                </div>
                <span
                  className={cn(
                    "mt-2 w-full truncate px-1 text-center text-xs",
                    active ? "font-medium" : "text-current/60"
                  )}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {caption && (
          <p className="mt-4 border-t border-current/15 pt-3 text-sm leading-relaxed text-current/60">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}
