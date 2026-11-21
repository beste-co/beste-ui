"use client";

import { cn } from "@/lib/utils";

interface Stat {
  label: string;
  value: string;
  /** Fills the tile with the primary color */
  highlight?: boolean;
}

interface Stats26Props {
  title?: string;
  label?: string;
  stats?: Stat[];
  bordered?: boolean;
  /** Stretch to the slot it sits in (inside a block) instead of keeping a card-sized box */
  fill?: boolean;
  /** The card behind the figures, or none to lay them straight on whatever is underneath */
  surface?: "card" | "none";
  className?: string;
}

export const stats26Demo: Stats26Props = {
  title: "October",
  label: "Report",
  stats: [
    { label: "Saved", value: "$86.40" },
    { label: "Sold to grid", value: "142 kWh" },
    { label: "Self-powered", value: "71%" },
    { label: "CO₂ avoided", value: "96 kg", highlight: true },
  ],
  bordered: false,
};

export function Stats26({ title, label, stats = [], bordered = false, fill = false, surface = "card", className }: Stats26Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div className={cn("flex w-full flex-col gap-3.5 rounded-2xl", surface === "card" && "bg-card p-5 text-card-foreground shadow-lg", !fill && "max-w-sm", bordered && "border border-border")}>
        <div className="flex justify-between text-sm">
          <span className="font-semibold">{title}</span>
          <span className="text-muted-foreground">{label}</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {stats.map((stat, index) => (
            <div key={index} className={cn("rounded-md p-3", stat.highlight ? "bg-primary text-primary-foreground" : "bg-muted")}>
              <div className={cn("text-sm", stat.highlight ? "text-primary-foreground/75" : "text-muted-foreground")}>{stat.label}</div>
              <div className="mt-0.5 text-xl font-bold tracking-tight">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
