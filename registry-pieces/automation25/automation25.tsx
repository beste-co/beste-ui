"use client";

import type { LucideIcon } from "lucide-react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface Slot {
  icon: LucideIcon;
  time: string;
  label: string;
  amount: string;
}

interface Automation25Props {
  slots?: Slot[];
  summary?: { label: string; value: string };
  /** Stretch to the slot it sits in (inside a block) instead of keeping a card-sized box */
  fill?: boolean;
  /** The card around the list; defaults to a card on its own and none inside a block */
  surface?: "card" | "none";
  className?: string;
}

export const automation25Demo: Automation25Props = {
  slots: [
    { icon: Sun, time: "11:00 – 15:00", label: "Surplus solar", amount: "+18 kWh" },
    { icon: Moon, time: "01:00 – 04:00", label: "Off-peak rate", amount: "+9 kWh" },
  ],
  summary: { label: "Ready by", value: "07:30 · 90%" },
};

export function Automation25({ slots = [], summary, fill = false, surface = fill ? "none" : "card", className }: Automation25Props) {
  const list = (
    <div className={cn("flex w-full flex-col gap-2.5", !fill && "max-w-sm", surface === "card" && "rounded-2xl bg-card p-4 text-card-foreground shadow-md")}>
      {slots.map((slot, index) => (
        <div key={index} className="flex items-center gap-3 rounded-lg bg-muted p-3.5 text-foreground">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-card text-chart-2">
            <slot.icon className="size-4.5" />
          </span>
          <div className="flex-1 text-sm">
            <div className="font-semibold">{slot.time}</div>
            <div className="text-muted-foreground">{slot.label}</div>
          </div>
          <span className="text-sm font-semibold text-chart-2">{slot.amount}</span>
        </div>
      ))}
      {summary && (
        <div className="flex items-center justify-between px-1 pt-1 text-sm">
          <span className="text-muted-foreground">{summary.label}</span>
          <span className="font-semibold">{summary.value}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className={cn("relative flex size-full justify-center", fill ? "items-end" : "items-center p-4", className)}>
      {list}
    </div>
  );
}
