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

interface Travel1Props {
  airline?: string;
  from?: string;
  to?: string;
  departTime?: string;
  arriveTime?: string;
  duration?: string;
  price?: string;
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

export const travel1Demo: Travel1Props = {
  airline: "Turkish Airlines",
  from: "IST",
  to: "LHR",
  departTime: "09:40",
  arriveTime: "12:20",
  duration: "4h 40m · Direct",
  price: "$312",
  tone: "neutral",
};

export function Travel1({
  airline,
  from,
  to,
  departTime,
  arriveTime,
  duration,
  price,
  tone = "neutral",
  className,
}: Travel1Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex size-7 items-center justify-center rounded-md",
                iconClasses[tone]
              )}
            >
              <Plane className="size-3.5" aria-hidden="true" />
            </div>
            <span className="text-xs font-semibold text-card-foreground">
              {airline}
            </span>
          </div>
          {price && (
            <span className="font-mono text-sm font-semibold text-card-foreground">
              {price}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-mono text-xl font-semibold text-card-foreground">
              {departTime}
            </span>
            <span className="text-xs text-muted-foreground">{from}</span>
          </div>
          <div className="relative flex flex-1 flex-col items-center gap-1">
            <span className="text-xs text-muted-foreground">{duration}</span>
            <div className="relative flex w-full items-center">
              <span
                className="size-1.5 rounded-full bg-border"
                aria-hidden="true"
              />
              <span
                className="h-px flex-1 border-t border-dashed border-border"
                aria-hidden="true"
              />
              <span
                className="size-1.5 rounded-full bg-border"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-mono text-xl font-semibold text-card-foreground">
              {arriveTime}
            </span>
            <span className="text-xs text-muted-foreground">{to}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
