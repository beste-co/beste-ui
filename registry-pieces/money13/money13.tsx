"use client";

import { cn } from "@/lib/utils";

interface Slice {
  label: string;
  pct: number;
}

interface Money13Props {
  title?: string;
  slices?: Slice[];
  className?: string;
}

const shades = [
  "bg-foreground",
  "bg-foreground/70",
  "bg-foreground/40",
  "bg-foreground/20",
  "bg-foreground/10",
];

export const money13Demo: Money13Props = {
  title: "Allocation",
  slices: [
    { label: "Equities", pct: 52 },
    { label: "Bonds", pct: 24 },
    { label: "Cash", pct: 14 },
    { label: "Crypto", pct: 10 },
  ],
};

export function Money13({ title, slices = [], className }: Money13Props) {
  const shown = slices.slice(0, shades.length);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-3 rounded-lg border border-border bg-card px-4 py-3.5 shadow-sm">
        {title && (
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {title}
          </span>
        )}
        <div className="flex h-2 w-full overflow-hidden rounded-full">
          {shown.map((slice, i) => (
            <div
              key={i}
              className={shades[i]}
              style={{ width: `${slice.pct}%` }}
              aria-hidden="true"
            />
          ))}
        </div>
        <div className="flex flex-col gap-1.5">
          {shown.map((slice, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <span className="flex items-center gap-2 text-card-foreground">
                <span
                  className={cn("size-2 rounded-full", shades[i])}
                  aria-hidden="true"
                />
                {slice.label}
              </span>
              <span className="tabular-nums text-muted-foreground">
                {slice.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
