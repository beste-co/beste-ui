"use client";

import { cn } from "@/lib/utils";

type Surface = "primary" | "muted" | "card" | "none";

interface Stats27Props {
  label?: string;
  value?: string;
  note?: string;
  /** Stretch to the slot it sits in (inside a block) instead of keeping a card-sized box */
  fill?: boolean;
  /** The tile color: deep primary (default), soft muted, the card color, or none to sit on whatever is underneath */
  surface?: Surface;
  className?: string;
}

export const stats27Demo: Stats27Props = {
  label: "Automations this week",
  value: "38",
  note: "Zero taps from you",
};

const surfaceClasses: Record<Surface, { panel: string; quiet: string; figure: string }> = {
  primary: { panel: "bg-primary text-primary-foreground", quiet: "text-primary-foreground/75", figure: "text-secondary" },
  muted: { panel: "bg-muted text-foreground", quiet: "text-muted-foreground", figure: "text-primary" },
  card: { panel: "bg-card text-card-foreground", quiet: "text-muted-foreground", figure: "text-primary" },
  none: { panel: "text-current", quiet: "opacity-75", figure: "text-current" },
};

export function Stats27({ label, value, note, fill = false, surface = "primary", className }: Stats27Props) {
  const tone = surfaceClasses[surface];
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div className={cn("flex min-h-50 flex-col items-center justify-center gap-1 rounded-xl", tone.panel, fill ? "size-full" : "h-50 w-full max-w-sm")}>
        <div className={cn("text-sm", tone.quiet)}>{label}</div>
        <div className={cn("font-serif text-6xl font-medium tracking-tight", tone.figure)}>{value}</div>
        <div className={cn("text-sm", tone.quiet)}>{note}</div>
      </div>
    </div>
  );
}
