"use client";

import { Stethoscope } from "lucide-react";
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

interface Health21Props {
  provider?: string;
  specialty?: string;
  when?: string;
  location?: string;
  reason?: string;
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

export const health21Demo: Health21Props = {
  provider: "Dr. Hania Rani",
  specialty: "Endocrinology",
  when: "Thu, May 2 · 09:30",
  location: "Memorial West",
  tone: "primary",
  bordered: false,
};

export function Health21({
  provider,
  specialty,
  when,
  location,
  reason,
  tone = "primary",
  bordered = false,
  className,
}: Health21Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <Stethoscope
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
        </div>
        {(when || location) && (
          <div className="rounded-md bg-muted p-2 text-sm">
            {when && (
              <span className="block font-semibold tabular-nums text-card-foreground">
                {when}
              </span>
            )}
            {location && (
              <span className="block text-xs text-muted-foreground">
                {location}
              </span>
            )}
          </div>
        )}
        {reason && (
          <span className="text-xs italic text-muted-foreground">
            {reason}
          </span>
        )}
      </div>
    </div>
  );
}
