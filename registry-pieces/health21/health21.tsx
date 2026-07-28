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

export const health21Demo: Health21Props = {
  provider: "Dr. Rana Elgin, MD",
  specialty: "Endocrinology",
  when: "Thu, May 2 · 09:30",
  location: "Memorial West · Suite 412",
  reason: "Annual check-up",
  tone: "sky",
};

export function Health21({
  provider,
  specialty,
  when,
  location,
  reason,
  tone = "sky",
  className,
}: Health21Props) {
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
              "flex size-8 items-center justify-center rounded-md",
              iconClasses[tone]
            )}
          >
            <Stethoscope className="size-4" aria-hidden="true" />
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
        </div>
        <div className="rounded-md bg-muted p-2 text-sm">
          {when && (
            <span className="block font-semibold text-card-foreground">
              {when}
            </span>
          )}
          {location && (
            <span className="block text-xs text-muted-foreground">
              {location}
            </span>
          )}
        </div>
        {reason && (
          <span className="text-xs italic text-muted-foreground">
            {reason}
          </span>
        )}
      </div>
    </div>
  );
}
