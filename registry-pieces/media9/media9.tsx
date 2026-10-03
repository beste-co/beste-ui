"use client";

import { cn } from "@/lib/utils";

interface Swatch {
  hex: string;
}

interface Media9Props {
  label?: string;
  swatches?: Swatch[];
  bordered?: boolean;
  className?: string;
}

export const media9Demo: Media9Props = {
  label: "Sunset",
  swatches: [
    { hex: "#0f172a" },
    { hex: "#7c3aed" },
    { hex: "#e11d48" },
    { hex: "#f97316" },
    { hex: "#facc15" },
  ],
  bordered: false,
};

export function Media9({
  label,
  swatches = [],
  bordered = false,
  className,
}: Media9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-64 flex-col gap-2 rounded-lg bg-card p-3 shadow-sm", bordered && "border border-border")}>
        {label && (
          <span className="text-sm font-semibold text-card-foreground">
            {label}
          </span>
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
              className="flex-1 truncate text-center text-xs tracking-tight text-muted-foreground"
            >
              {s.hex.replace("#", "")}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
