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
  bordered?: boolean;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  neutral: "text-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-500",
  emerald: "text-emerald-500",
  violet: "text-violet-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
};

export const health15Demo: Health15Props = {
  distance: "10.2 km",
  totalTime: "49:18",
  label: "Run",
  splits: [
    { km: 1, pace: "4:38" },
    { km: 2, pace: "4:52" },
    { km: 3, pace: "4:41" },
  ],
  tone: "neutral",
  bordered: false,
};

export function Health15({
  distance,
  totalTime,
  avgPace,
  splits = [],
  label = "Run",
  tone = "neutral",
  bordered = false,
  className,
}: Health15Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin
              className={cn("size-5 shrink-0", iconClasses[tone])}
              aria-hidden="true"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold tabular-nums text-card-foreground">
                {distance}
              </span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold tabular-nums text-card-foreground">
              {totalTime}
            </span>
            {avgPace && (
              <span className="text-xs tabular-nums text-muted-foreground">
                avg {avgPace}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col divide-y divide-border">
          {splits.map((split, idx) => (
            <div
              key={idx}
              className={cn(
                "items-center py-1.5 text-sm tabular-nums",
                split.elevation ? "grid grid-cols-3" : "flex justify-between"
              )}
            >
              <span className="font-semibold text-muted-foreground">
                km {split.km}
              </span>
              <span className="justify-self-center font-semibold text-card-foreground">
                {split.pace}
              </span>
              {split.elevation && (
                <span className="justify-self-end text-xs text-muted-foreground">
                  {split.elevation}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
