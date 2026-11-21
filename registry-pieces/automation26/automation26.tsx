"use client";

import type { LucideIcon } from "lucide-react";
import { Leaf, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "muted" | "card" | "none";

interface Automation26Props {
  /** The device being connected */
  source?: LucideIcon;
  /** The app it connects to */
  target?: LucideIcon;
  /** Stretch to the slot it sits in (inside a block) instead of keeping a card-sized box */
  fill?: boolean;
  /** The panel behind the tiles: soft muted (default), the card color, or none to sit on whatever is underneath */
  surface?: Surface;
  className?: string;
}

export const automation26Demo: Automation26Props = {
  source: Sun,
  target: Leaf,
};

const surfaceClasses: Record<Surface, string> = { muted: "bg-muted", card: "bg-card", none: "" };

export function Automation26({ source: Source, target: Target, fill = false, surface = "muted", className }: Automation26Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div className={cn("flex min-h-50 items-center justify-center gap-3 rounded-xl", surfaceClasses[surface], fill ? "size-full" : "h-50 w-full max-w-sm")}>
        <span className={cn("flex size-16 items-center justify-center rounded-lg text-chart-2 shadow-md", surface === "muted" ? "bg-card" : "bg-muted")}>{Source && <Source className="size-6.5" />}</span>
        <svg aria-hidden="true" viewBox="0 0 48 12" className="h-3 w-12 text-chart-2">
          <path d="M0 6h44M38 1l6 5-6 5" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" />
        </svg>
        <span className="flex size-16 items-center justify-center rounded-lg bg-primary text-secondary">{Target && <Target className="size-7" />}</span>
      </div>
    </div>
  );
}
