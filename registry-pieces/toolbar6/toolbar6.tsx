"use client";

import { Check, Pipette } from "lucide-react";
import { cn } from "@/lib/utils";

interface Swatch {
  color: string;
  label: string;
}

interface Toolbar6Props {
  swatches?: Swatch[];
  active?: string;
  className?: string;
}

export const toolbar6Demo: Toolbar6Props = {
  swatches: [
    { color: "#0f172a", label: "Slate" },
    { color: "#ef4444", label: "Rose" },
    { color: "#f59e0b", label: "Amber" },
    { color: "#10b981", label: "Emerald" },
    { color: "#0ea5e9", label: "Sky" },
    { color: "#8b5cf6", label: "Violet" },
  ],
  active: "#10b981",
};

export function Toolbar6({
  swatches = [],
  active,
  className,
}: Toolbar6Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-sm">
        {swatches.map((s) => {
          const isActive = s.color === active;
          return (
            <button
              key={s.color}
              type="button"
              aria-label={s.label}
              aria-pressed={isActive}
              className="flex size-6 items-center justify-center rounded-full transition-transform"
              style={{ backgroundColor: s.color }}
            >
              {isActive && (
                <Check
                  className="size-3 text-white"
                  strokeWidth={3}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
        <div className="mx-0.5 h-5 w-px bg-border" aria-hidden="true" />
        <button
          type="button"
          aria-label="Custom color"
          className="flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
        >
          <Pipette className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
