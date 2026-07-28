"use client";

import { Building2, School, Trees } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "sky"
  | "emerald"
  | "violet"
  | "amber"
  | "rose";

interface WalkItem {
  label: string;
  distance: string;
  icon: "transit" | "park" | "school";
}

interface Realestate8Props {
  walkScore?: number;
  label?: string;
  summary?: string;
  items?: WalkItem[];
  tone?: Tone;
  className?: string;
}

const scoreClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  violet: "bg-violet-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
};

const iconMap = {
  transit: Building2,
  park: Trees,
  school: School,
};

export const realestate8Demo: Realestate8Props = {
  walkScore: 92,
  label: "Walk score",
  summary: "Walker's paradise · most errands don't require a car.",
  items: [
    { label: "Metro · Levent", distance: "3 min walk", icon: "transit" },
    { label: "Emirgan Park", distance: "8 min walk", icon: "park" },
    { label: "Austrian Lycée", distance: "12 min walk", icon: "school" },
  ],
  tone: "primary",
};

export function Realestate8({
  walkScore = 0,
  label,
  summary,
  items = [],
  tone = "primary",
  className,
}: Realestate8Props) {
  const pct = Math.max(0, Math.min(100, walkScore));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-full font-mono text-lg font-bold",
              scoreClasses[tone]
            )}
          >
            {pct}
          </div>
          <div className="flex flex-col">
            {label && (
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {label}
              </span>
            )}
            {summary && (
              <span className="text-sm text-card-foreground">{summary}</span>
            )}
          </div>
        </div>
        <div className="flex flex-col divide-y divide-border">
          {items.map((item, idx) => {
            const Icon = iconMap[item.icon];
            return (
              <div
                key={idx}
                className="flex items-center gap-2 py-1.5 text-sm"
              >
                <Icon
                  className="size-3.5 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="flex-1 truncate text-card-foreground">
                  {item.label}
                </span>
                <span className="shrink-0 text-muted-foreground">
                  {item.distance}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
