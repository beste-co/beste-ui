"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type SwatchColor =
  | "black"
  | "white"
  | "navy"
  | "tan"
  | "olive"
  | "burgundy"
  | "forest"
  | "slate";

interface Commerce2Swatch {
  color: SwatchColor;
  label: string;
  soldOut?: boolean;
}

interface Commerce2Props {
  title?: string;
  swatches?: Commerce2Swatch[];
  selected?: string;
  className?: string;
}

const swatchClasses: Record<SwatchColor, string> = {
  black: "bg-neutral-900",
  white: "bg-neutral-50 ring-1 ring-inset ring-border",
  navy: "bg-indigo-950",
  tan: "bg-amber-700",
  olive: "bg-lime-800",
  burgundy: "bg-red-900",
  forest: "bg-emerald-900",
  slate: "bg-slate-600",
};

export const commerce2Demo: Commerce2Props = {
  title: "Color",
  selected: "Tan",
  swatches: [
    { color: "black", label: "Black" },
    { color: "white", label: "Ivory" },
    { color: "tan", label: "Tan" },
    { color: "navy", label: "Navy" },
    { color: "olive", label: "Olive", soldOut: true },
    { color: "burgundy", label: "Burgundy" },
  ],
};

export function Commerce2({
  title = "Color",
  swatches = [],
  selected,
  className,
}: Commerce2Props) {
  const active = swatches.find((s) => s.label === selected);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-64 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </span>
          {active && (
            <span className="text-xs font-medium text-card-foreground">
              {active.label}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {swatches.map((s) => {
            const isSelected = s.label === selected;
            return (
              <button
                key={s.label}
                type="button"
                aria-label={s.label}
                aria-pressed={isSelected}
                disabled={s.soldOut}
                className={cn(
                  "relative flex size-7 items-center justify-center rounded-full transition-all",
                  isSelected
                    ? "ring-2 ring-foreground ring-offset-2 ring-offset-card"
                    : "",
                  s.soldOut && "cursor-not-allowed opacity-50"
                )}
              >
                <span
                  className={cn(
                    "block size-6 rounded-full",
                    swatchClasses[s.color]
                  )}
                  aria-hidden="true"
                />
                {isSelected && !s.soldOut && (
                  <Check
                    className={cn(
                      "absolute size-3",
                      s.color === "white" ? "text-foreground" : "text-white"
                    )}
                    aria-hidden="true"
                  />
                )}
                {s.soldOut && (
                  <span
                    className="absolute inset-x-0 top-1/2 h-px -rotate-45 bg-foreground/60"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
