"use client";

import { cn } from "@/lib/utils";

type SwatchTone =
  | "violet"
  | "sky"
  | "emerald"
  | "amber"
  | "rose"
  | "slate";

interface Swatch {
  tone: SwatchTone;
  name: string;
  hex?: string;
}

interface Form26Props {
  label?: string;
  swatches?: Swatch[];
  selectedIndex?: number;
  className?: string;
}

const swatchClasses: Record<SwatchTone, string> = {
  violet: "bg-violet-500",
  sky: "bg-sky-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  slate: "bg-slate-800",
};

export const form26Demo: Form26Props = {
  label: "Accent color",
  swatches: [
    { tone: "violet", name: "Violet", hex: "#6D5EFA" },
    { tone: "sky", name: "Sky", hex: "#0EA5E9" },
    { tone: "emerald", name: "Emerald", hex: "#10B981" },
    { tone: "amber", name: "Amber", hex: "#F59E0B" },
    { tone: "rose", name: "Rose", hex: "#EF4444" },
    { tone: "slate", name: "Slate", hex: "#111827" },
  ],
  selectedIndex: 0,
};

export function Form26({
  label,
  swatches = [],
  selectedIndex = 0,
  className,
}: Form26Props) {
  const selected = swatches[selectedIndex];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-fit flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          {label && (
            <label className="text-xs font-medium text-card-foreground">
              {label}
            </label>
          )}
          {selected && (
            <span className="font-mono text-xs text-muted-foreground">
              {selected.name} · {selected.hex}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {swatches.map((s, idx) => (
            <button
              key={idx}
              type="button"
              className={cn(
                "flex size-8 items-center justify-center rounded-full border-2 border-card transition-all",
                swatchClasses[s.tone],
                idx === selectedIndex && "ring-2 ring-card-foreground"
              )}
              aria-label={s.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
