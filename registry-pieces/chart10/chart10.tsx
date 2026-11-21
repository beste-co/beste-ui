"use client";

import { cn } from "@/lib/utils";

interface ForecastBar {
  value: number;
  /** Lights the bar in the secondary color as a recommended hour */
  best?: boolean;
}

interface Chart10Props {
  label?: string;
  legend?: { series: string; best: string };
  /** Bar heights in percent of the tallest, left to right */
  bars?: ForecastBar[];
  ticks?: string[];
  bordered?: boolean;
  /** Stretch to the slot it sits in (inside a block) instead of keeping a card-sized box */
  fill?: boolean;
  /** The card behind the chart, or none to draw it straight on whatever is underneath */
  surface?: "card" | "none";
  className?: string;
}

export const chart10Demo: Chart10Props = {
  label: "Tomorrow",
  legend: { series: "Solar", best: "Best time to use" },
  bars: [
    { value: 6 },
    { value: 14 },
    { value: 28 },
    { value: 46 },
    { value: 66 },
    { value: 84, best: true },
    { value: 96, best: true },
    { value: 100, best: true },
    { value: 88 },
    { value: 70 },
    { value: 48 },
    { value: 26 },
    { value: 10 },
  ],
  ticks: ["06:00", "09:00", "12:00", "15:00", "18:00"],
  bordered: false,
};

// Taller bars read darker, so the peak carries the deepest chart color
function barTone(value: number) {
  if (value <= 20) return "bg-chart-5";
  if (value <= 35) return "bg-chart-4";
  if (value <= 55) return "bg-chart-3";
  if (value < 100) return "bg-chart-2";
  return "bg-chart-1";
}

export function Chart10({ label, legend, bars = [], ticks = [], bordered = false, fill = false, surface = "card", className }: Chart10Props) {
  return (
    <div className={cn("relative flex size-full justify-center", fill ? "items-end" : "items-center p-4", className)}>
      <div className={cn("w-full rounded-2xl", surface === "card" && "bg-card p-5 text-card-foreground shadow-xs", !fill && "max-w-md", bordered && "border border-border")}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm">
          <div className="font-semibold">{label}</div>
          {legend && (
            <div className="flex gap-3.5 text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-xs bg-chart-2" />
                {legend.series}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-xs bg-secondary" />
                {legend.best}
              </span>
            </div>
          )}
        </div>
        <div className="flex h-36 items-end gap-1.5">
          {bars.map((bar, index) => (
            <span key={index} style={{ height: `${bar.value}%` }} className={cn("flex-1 rounded-sm", bar.best ? "bg-secondary" : barTone(bar.value))} />
          ))}
        </div>
        {ticks.length > 0 && (
          <div className="mt-2.5 flex justify-between text-sm text-muted-foreground">
            {ticks.map((tick, index) => (
              <span key={index}>{tick}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
