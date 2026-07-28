"use client";

import { cn } from "@/lib/utils";

interface Swatch {
  hex: string;
}

interface Media9Props {
  label?: string;
  swatches?: Swatch[];
  className?: string;
}

export const media9Demo: Media9Props = {
  label: "Sunset · 05",
  swatches: [
    { hex: "#0f172a" },
    { hex: "#7c3aed" },
    { hex: "#e11d48" },
    { hex: "#f97316" },
    { hex: "#facc15" },
  ],
};

export function Media9({
  label,
  swatches = [],
  className,
}: Media9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-64 flex-col gap-2 rounded-lg border border-border bg-card p-3 shadow-sm">
        {label && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-card-foreground">
              {label}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {swatches.length} colors
            </span>
          </div>
        )}
        <div className="flex overflow-hidden rounded-md" aria-hidden="true">
          {swatches.map((s, i) => (
            <div
              key={i}
              className="h-14 flex-1"
              style={{ backgroundColor: s.hex }}
            />
          ))}
        </div>
        <div className="flex gap-1">
          {swatches.map((s, i) => (
            <span
              key={i}
              className="flex-1 truncate text-center font-mono text-xs uppercase tracking-tight text-muted-foreground"
            >
              {s.hex.replace("#", "")}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
