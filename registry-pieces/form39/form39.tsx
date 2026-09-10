"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface ConsentCategory {
  label: string;
  /** Where this row ends up once the visitor has been through the list. */
  enabled?: boolean;
  required?: boolean;
}

interface Form39Props {
  title?: string;
  requiredLabel?: string;
  categories?: ConsentCategory[];
  stepMs?: number;
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

export const form39Demo: Form39Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  title: "Cookie Preferences",
  requiredLabel: "Required",
  categories: [
    { label: "Necessary", enabled: true, required: true },
    { label: "Functional", enabled: true },
    { label: "Analytics", enabled: false },
    { label: "Marketing", enabled: false },
  ],
  stepMs: 620,
};

/* Only the knob travels and the track changes colour. The rows are a fixed
   height throughout, whichever way each switch ends up. */
const STYLES = `
@keyframes form39-focus { from { opacity: 0; } to { opacity: 1; } }
.form39-focus { animation: form39-focus 240ms ease-out both; }
@media (prefers-reduced-motion: reduce) { .form39-focus { animation: none; } }
`;

/* The knob is the card's own surface, not `current`: a switch reads as a hole
   punched through the track, and `current` would make it the ink instead. */
function Toggle({
  on,
  locked,
  inverted,
}: {
  on: boolean;
  locked: boolean;
  inverted: boolean;
}) {
  return (
    <span
      className={cn(
        "relative h-4 w-7 shrink-0 rounded-full transition-colors duration-300 motion-reduce:transition-none",
        on ? "bg-emerald-500" : "bg-current/10",
        locked && "opacity-70"
      )}
      aria-hidden="true"
    >
      <span
        className={cn(
          "absolute top-0.5 size-3 rounded-full transition-all duration-300 ease-out motion-reduce:transition-none",
          inverted ? "bg-foreground" : "bg-card",
          on ? "left-3.5" : "left-0.5"
        )}
      />
    </span>
  );
}

export function Form39({
  title,
  requiredLabel = "Required",
  categories = [],
  stepMs = 620,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Form39Props) {
  const [decided, setDecided] = useState(0);

  useEffect(() => {
    if (decided >= categories.length) return;
    const id = setTimeout(() => setDecided((value) => value + 1), stepMs);
    return () => clearTimeout(id);
  }, [decided, categories.length, stepMs]);

  const tone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{STYLES}</style>

      <div
        className={cn(
          "flex w-full max-w-72 flex-col gap-3 rounded-xl p-4 shadow-sm",
          tone,
          bordered && "border border-current/15"
        )}
      >
        {title && (
          <h3 className="text-sm font-semibold">
            {title}
          </h3>
        )}

        <div className="flex flex-col">
          {categories.map((category, index) => {
            const settled = index < decided;
            const on = settled ? Boolean(category.enabled) : false;

            return (
              <div
                key={category.label}
                className={cn(
                  "-mx-2 flex items-center justify-between gap-3 rounded-md px-2 py-1.5",
                  index === decided && "form39-focus bg-current/10"
                )}
              >
                <span className="flex min-w-0 items-center gap-1.5">
                  {category.required && (
                    <Lock
                      className="size-3 shrink-0 opacity-60"
                      aria-hidden="true"
                    />
                  )}
                  <span className="truncate text-xs">
                    {category.label}
                  </span>
                  {category.required && requiredLabel && (
                    <span className="shrink-0 text-xs opacity-60">
                      {requiredLabel}
                    </span>
                  )}
                </span>
                <Toggle
                  on={on || Boolean(category.required)}
                  locked={Boolean(category.required)}
                  inverted={inverted}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
