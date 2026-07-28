"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber";

interface Commerce3Size {
  label: string;
  soldOut?: boolean;
}

interface Commerce3Props {
  title?: string;
  sizes?: Commerce3Size[];
  selected?: string;
  sizeGuideLabel?: string;
  tone?: Tone;
  className?: string;
}

const selectedClasses: Record<Tone, string> = {
  primary: "border-primary bg-primary text-primary-foreground",
  foreground: "border-foreground bg-foreground text-background",
  violet: "border-violet-500 bg-violet-500 text-white",
  emerald: "border-emerald-500 bg-emerald-500 text-white",
  sky: "border-sky-500 bg-sky-500 text-white",
  amber: "border-amber-500 bg-amber-500 text-white",
};

export const commerce3Demo: Commerce3Props = {
  title: "Size",
  selected: "M",
  sizeGuideLabel: "Size guide",
  sizes: [
    { label: "XS" },
    { label: "S", soldOut: true },
    { label: "M" },
    { label: "L" },
    { label: "XL" },
    { label: "XXL", soldOut: true },
  ],
  tone: "foreground",
};

export function Commerce3({
  title = "Size",
  sizes = [],
  selected,
  sizeGuideLabel,
  tone = "foreground",
  className,
}: Commerce3Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </span>
          {sizeGuideLabel && (
            <button
              type="button"
              className="text-xs text-muted-foreground underline-offset-2 hover:underline"
            >
              {sizeGuideLabel}
            </button>
          )}
        </div>
        <div className="grid grid-cols-6 gap-1.5">
          {sizes.map((s) => {
            const isSelected = s.label === selected;
            return (
              <button
                key={s.label}
                type="button"
                aria-pressed={isSelected}
                disabled={s.soldOut}
                className={cn(
                  "relative flex h-8 items-center justify-center rounded-sm border text-xs font-medium transition-colors",
                  isSelected
                    ? selectedClasses[tone]
                    : "border-border bg-card text-card-foreground hover:bg-muted",
                  s.soldOut && "cursor-not-allowed text-muted-foreground"
                )}
              >
                {s.label}
                {s.soldOut && (
                  <span
                    className="absolute inset-x-1 top-1/2 h-px -rotate-12 bg-foreground/60"
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
