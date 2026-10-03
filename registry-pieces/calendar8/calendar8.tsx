"use client";

import { cn } from "@/lib/utils";

interface Calendar8Props {
  label?: string;
  caption?: string;
  bordered?: boolean;
  className?: string;
}

export const calendar8Demo: Calendar8Props = {
  caption: "342 commits in the last year",
  bordered: false,
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
  bordered = false,
  className,
}: Calendar8Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        {label && (
          <span className="text-xs font-semibold text-muted-foreground">
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
        {caption && (
          <span className="text-xs tabular-nums text-muted-foreground">
            {caption}
          </span>
        )}
      </div>
    </div>
  );
}
