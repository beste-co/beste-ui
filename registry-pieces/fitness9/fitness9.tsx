"use client";

import { Moon } from "lucide-react";
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

interface Fitness9Props {
  message?: string;
  readiness?: string;
  activities?: string[];
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

const bulletClasses: Record<Tone, string> = {
  neutral: "bg-foreground",
  primary: "bg-primary",
  foreground: "bg-foreground",
  sky: "bg-sky-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

export const fitness9Demo: Fitness9Props = {
  message: "Recovery day",
  activities: [
    "Easy walk outside",
    "Mobility flow",
    "Early night",
  ],
  tone: "primary",
  bordered: false,
};

export function Fitness9({
  message,
  readiness,
  activities = [],
  tone = "primary",
  bordered = false,
  className,
}: Fitness9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <Moon
            className={cn("size-5 fill-current shrink-0", iconClasses[tone])}
            aria-hidden="true"
          />
          <div className="flex flex-col">
            {message && (
              <span className="text-sm font-semibold text-card-foreground">
                {message}
              </span>
            )}
            {readiness && (
              <span className="text-xs italic text-muted-foreground">
                {readiness}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          {activities.map((a, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <span
                className={cn(
                  "mt-1.5 size-1.5 shrink-0 rounded-full",
                  bulletClasses[tone]
                )}
                aria-hidden="true"
              />
              <span className="text-card-foreground">{a}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
