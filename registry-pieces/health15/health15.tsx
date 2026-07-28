"use client";

import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "sky"
  | "emerald"
  | "violet"
  | "amber"
  | "rose";

interface Split {
  km: number;
  pace: string;
  elevation?: string;
}

interface Health15Props {
  distance?: string;
  totalTime?: string;
  avgPace?: string;
  splits?: Split[];
  label?: string;
  tone?: Tone;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  neutral: "bg-muted text-foreground",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  violet: "bg-violet-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
};

export const health15Demo: Health15Props = {
  distance: "10.2 km",
  totalTime: "49:18",
  avgPace: "4:49 / km",
  label: "Run",
  splits: [
    { km: 1, pace: "4:38", elevation: "+ 12 m" },
    { km: 2, pace: "4:52", elevation: "- 4 m" },
    { km: 3, pace: "4:41", elevation: "+ 8 m" },
  ],
  tone: "neutral",
};

export function Health15({
  distance,
  totalTime,
  avgPace,
  splits = [],
  label = "Run",
  tone = "neutral",
  className,
}: Health15Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex size-8 items-center justify-center rounded-md",
                iconClasses[tone]
              )}
            >
              <MapPin className="size-4" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-lg font-bold text-card-foreground">
                {distance}
              </span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-mono text-sm font-semibold text-card-foreground">
              {totalTime}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              avg {avgPace}
            </span>
          </div>
        </div>
        <div className="flex flex-col divide-y divide-border">
          {splits.map((split, idx) => (
            <div
              key={idx}
              className="grid grid-cols-3 items-center py-1.5 text-sm"
            >
              <span className="font-mono font-semibold text-muted-foreground">
                km {split.km}
              </span>
              <span className="justify-self-center font-mono font-semibold text-card-foreground">
                {split.pace}
              </span>
              <span className="justify-self-end font-mono text-xs text-muted-foreground">
                {split.elevation}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
