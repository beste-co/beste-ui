"use client";

import { cn } from "@/lib/utils";

interface Mode {
  label: string;
  active?: boolean;
}

interface Progress22Props {
  /** Filled share of the ring, 0 to 100 */
  level?: number;
  value?: string;
  note?: string;
  /** Mode chips under the ring; the active one takes the fill color */
  modes?: Mode[];
  tone?: "secondary" | "primary";
  /** Stretch to the slot it sits in (inside a block) instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const progress22Demo: Progress22Props = {
  level: 82,
  value: "82%",
  note: "Full by 14:20",
  modes: [{ label: "Auto", active: true }, { label: "Backup reserve 20%" }, { label: "Storm mode" }],
  tone: "secondary",
};

const fillColor = { secondary: "var(--secondary)", primary: "var(--primary)" };
const chip = { secondary: "bg-secondary text-secondary-foreground", primary: "bg-primary text-primary-foreground" };

/* The ring is a masked conic gradient, so its middle stays see-through on any surface. */
export function Progress22({ level = 0, value, note, modes = [], tone = "secondary", fill = false, className }: Progress22Props) {
  return (
    <div className={cn("relative mx-auto flex size-full flex-col items-center gap-8", fill ? "justify-end" : "max-w-xs justify-center p-4", className)}>
      <div className="relative flex size-50 items-center justify-center">
        <div
          aria-hidden="true"
          style={{
            background: `conic-gradient(${fillColor[tone]} 0 ${level}%, color-mix(in oklab, currentColor 12%, transparent) ${level}% 100%)`,
            mask: "radial-gradient(farthest-side, transparent calc(100% - 1.125rem), #000 calc(100% - 1.125rem))",
          }}
          className="absolute inset-0 rounded-full"
        />
        <div className="flex flex-col items-center">
          <div className="font-serif text-5xl font-medium tracking-tight">{value}</div>
          <div className="text-sm opacity-70">{note}</div>
        </div>
      </div>
      {modes.length > 0 && (
        <div className="flex w-full flex-wrap gap-2">
          {modes.map((mode, index) => (
            <span key={index} className={cn("rounded-full px-3 py-2 text-sm font-bold leading-tight", mode.active ? chip[tone] : "bg-current/10")}>
              {mode.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
