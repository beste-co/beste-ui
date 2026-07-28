"use client";

import { cn } from "@/lib/utils";

interface Calendar8Props {
  label?: string;
  caption?: string;
  className?: string;
}

export const calendar8Demo: Calendar8Props = {
  label: "Commit activity",
  caption: "342 commits in the last year",
};

const weeks = 20;
const days = 7;

function intensity(idx: number) {
  const pattern = [0, 0, 1, 0, 2, 1, 3, 2, 1, 0, 1, 2, 3, 4, 2, 1, 0, 1, 2, 3];
  return pattern[idx % pattern.length] ?? 0;
}

const intensityClasses = [
  "bg-muted",
  "bg-emerald-500/25",
  "bg-emerald-500/50",
  "bg-emerald-500/75",
  "bg-emerald-500",
];

export function Calendar8({
  label,
  caption,
  className,
}: Calendar8Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        {label && (
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
        )}
        <div
          className="grid gap-0.5"
          style={{
            gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${days}, minmax(0, 1fr))`,
            gridAutoFlow: "column",
          }}
          aria-hidden="true"
        >
          {Array.from({ length: weeks * days }).map((_, idx) => {
            const value = intensity(idx + Math.floor(idx / 7));
            return (
              <span
                key={idx}
                className={cn(
                  "aspect-square rounded-sm",
                  intensityClasses[value]
                )}
              />
            );
          })}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{caption}</span>
          <div className="flex items-center gap-1" aria-hidden="true">
            <span>Less</span>
            {intensityClasses.map((c, idx) => (
              <span key={idx} className={cn("size-2 rounded-sm", c)} />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
