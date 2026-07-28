"use client";

import { Video } from "lucide-react";
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

interface Health30Props {
  provider?: string;
  specialty?: string;
  startsIn?: string;
  cost?: string;
  action?: string;
  tone?: Tone;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  neutral: "bg-foreground text-background",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  violet: "bg-violet-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
};

const buttonClasses: Record<Tone, string> = {
  neutral: "bg-foreground text-background",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  violet: "bg-violet-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
};

export const health30Demo: Health30Props = {
  provider: "Dr. Maya Chen",
  specialty: "Telemedicine · General practice",
  startsIn: "Starts in 12 min",
  cost: "Covered by insurance",
  action: "Join visit",
  tone: "sky",
};

export function Health30({
  provider,
  specialty,
  startsIn,
  cost,
  action = "Join visit",
  tone = "sky",
  className,
}: Health30Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-9 items-center justify-center rounded-full shadow-md",
              iconClasses[tone]
            )}
          >
            <Video className="size-4" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {provider && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {provider}
              </span>
            )}
            {specialty && (
              <span className="truncate text-xs text-muted-foreground">
                {specialty}
              </span>
            )}
          </div>
          {startsIn && (
            <span className="shrink-0 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
              {startsIn}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-border pt-2 text-xs">
          {cost && (
            <span className="text-muted-foreground">{cost}</span>
          )}
          <button
            type="button"
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-semibold hover:opacity-90",
              buttonClasses[tone]
            )}
          >
            {action}
          </button>
        </div>
      </div>
    </div>
  );
}
