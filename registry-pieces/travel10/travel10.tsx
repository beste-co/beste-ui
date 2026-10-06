"use client";

import { Plane } from "lucide-react";
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

interface Travel10Props {
  label?: string;
  destination?: string;
  days?: number;
  daysLabel?: string;
  detail?: string;
  progress?: number;
  tone?: Tone;
  bordered?: boolean;
  className?: string;
}

const cardClasses: Record<Tone, string> = {
  neutral: "bg-card text-card-foreground",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-gradient-to-br from-sky-500 to-indigo-500 text-white",
  emerald: "bg-gradient-to-br from-emerald-500 to-teal-500 text-white",
  violet: "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white",
  amber: "bg-gradient-to-br from-amber-500 to-orange-500 text-white",
  rose: "bg-gradient-to-br from-rose-500 to-pink-500 text-white",
};

export const travel10Demo: Travel10Props = {
  destination: "Lisbon · Jun 14",
  days: 12,
  daysLabel: "days to go",
  progress: 84,
  tone: "neutral",
  bordered: false,
};

export function Travel10({
  label,
  destination,
  days = 0,
  daysLabel,
  detail,
  progress = 0,
  tone = "neutral",
  bordered = false,
  className,
}: Travel10Props) {
  const pct = Math.max(0, Math.min(100, progress));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full max-w-80 flex-col gap-3 rounded-xl p-4 shadow-sm",
          cardClasses[tone],
          bordered && "border border-border"
        )}
      >
        <div className="flex items-center gap-3">
          <Plane className="-rotate-45 size-5 shrink-0" aria-hidden="true" />
          <div className="flex min-w-0 flex-1 flex-col">
            {label && (
              <span className="text-xs font-semibold opacity-70">
                {label}
              </span>
            )}
            {destination && (
              <span className="truncate text-sm font-semibold">
                {destination}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold leading-none tabular-nums">
              {days}
            </span>
            {daysLabel && (
              <span className="text-xs font-medium opacity-70">
                {daysLabel}
              </span>
            )}
          </div>
        </div>

        <div
          className="h-1 overflow-hidden rounded-full bg-current/15"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full bg-current"
            style={{ width: `${pct}%` }}
          />
        </div>

        {detail && (
          <span className="text-sm opacity-80">{detail}</span>
        )}
      </div>
    </div>
  );
}
