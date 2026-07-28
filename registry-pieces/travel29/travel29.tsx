"use client";

import { Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "violet"
  | "sky"
  | "emerald"
  | "amber"
  | "rose";

interface Travel29Props {
  carrier?: string;
  plan?: string;
  dataUsed?: string;
  dataTotal?: string;
  percent?: number;
  validity?: string;
  tone?: Tone;
  className?: string;
}

const cardClasses: Record<Tone, string> = {
  neutral: "border border-border bg-background text-foreground",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  violet: "bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white",
  sky: "bg-gradient-to-br from-sky-500 to-indigo-500 text-white",
  emerald: "bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-500 text-white",
  amber: "bg-gradient-to-br from-amber-500 to-orange-500 text-white",
  rose: "bg-gradient-to-br from-rose-500 via-pink-500 to-orange-500 text-white",
};

export const travel29Demo: Travel29Props = {
  carrier: "Airalo · Japan eSIM",
  plan: "5 GB · 15 days",
  dataUsed: "2.4 GB",
  dataTotal: "5 GB",
  percent: 48,
  validity: "12 days left · Expires May 4",
  tone: "neutral",
};

export function Travel29({
  carrier,
  plan,
  dataUsed,
  dataTotal,
  percent = 0,
  validity,
  tone = "neutral",
  className,
}: Travel29Props) {
  const pct = Math.max(0, Math.min(100, percent));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full max-w-80 flex-col gap-2 rounded-xl p-3 shadow-md",
          cardClasses[tone]
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-md bg-current/10 backdrop-blur">
              <Wifi className="size-4" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              {carrier && (
                <span className="text-sm font-semibold">{carrier}</span>
              )}
              {plan && (
                <span className="text-sm opacity-80">{plan}</span>
              )}
            </div>
          </div>
          <span className="rounded-full bg-current/10 px-2 py-0.5 font-mono text-xs">
            {dataUsed} / {dataTotal}
          </span>
        </div>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-current/20"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full bg-current"
            style={{ width: `${pct}%` }}
          />
        </div>
        {validity && (
          <span className="text-sm opacity-80">{validity}</span>
        )}
      </div>
    </div>
  );
}
