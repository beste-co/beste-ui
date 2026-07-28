"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber";

interface Dashboard26Step {
  label: string;
  date?: string;
}

interface Dashboard26Props {
  heading?: string;
  steps?: Dashboard26Step[];
  current?: number;
  tone?: Tone;
  className?: string;
}

const activeClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  violet: "bg-violet-500 text-white",
  emerald: "bg-emerald-500 text-white",
  sky: "bg-sky-500 text-white",
  amber: "bg-amber-500 text-white",
};

const lineClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  amber: "bg-amber-500",
};

export const dashboard26Demo: Dashboard26Props = {
  heading: "Milestones",
  steps: [
    { label: "Design", date: "Apr 2" },
    { label: "Build", date: "Apr 12" },
    { label: "QA", date: "Apr 22" },
    { label: "Launch", date: "May 3" },
  ],
  current: 2,
  tone: "violet",
};

export function Dashboard26({
  heading = "Milestones",
  steps = [],
  current = 0,
  tone = "violet",
  className,
}: Dashboard26Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {heading}
        </span>
        <div className="relative flex items-center justify-between">
          <span
            className="absolute inset-x-2 top-2.5 h-0.5 bg-muted"
            aria-hidden="true"
          />
          {current > 0 && steps.length > 1 && (
            <span
              className={cn(
                "absolute left-2 top-2.5 h-0.5",
                lineClasses[tone]
              )}
              style={{
                width: `calc((100% - 1rem) * ${
                  Math.min(current, steps.length - 1) /
                  Math.max(1, steps.length - 1)
                })`,
              }}
              aria-hidden="true"
            />
          )}
          {steps.map((s, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <div
                key={s.label}
                className="relative flex flex-col items-center gap-1"
              >
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full text-xs font-semibold",
                    done
                      ? activeClasses[tone]
                      : active
                        ? cn(
                            "ring-2 ring-offset-2 ring-offset-card",
                            activeClasses[tone]
                          )
                        : "bg-muted text-muted-foreground"
                  )}
                  aria-hidden="true"
                >
                  {done ? <Check className="size-3" /> : i + 1}
                </span>
                <span
                  className={cn(
                    "text-xs",
                    active
                      ? "font-semibold text-card-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {s.label}
                </span>
                {s.date && (
                  <span className="font-mono text-xs text-muted-foreground">
                    {s.date}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
