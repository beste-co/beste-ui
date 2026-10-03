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
  provider: "Dr. Ólafur Arnalds",
  specialty: "General practice",
  startsIn: "In 12 min",
  action: "Join visit",
  tone: "primary",
  bordered: false,
};

export function Health30({
  provider,
  specialty,
  startsIn,
  cost,
  action = "Join visit",
  tone = "primary",
  bordered = false,
  className,
}: Health30Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <Video
            className={cn("size-5 shrink-0", iconClasses[tone])}
            aria-hidden="true"
          />
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
            <span className="shrink-0 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold tabular-nums text-amber-700 dark:text-amber-300">
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
              "ml-auto rounded-md px-3 py-1.5 text-sm font-semibold hover:opacity-90",
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
