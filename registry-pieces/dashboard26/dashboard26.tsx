"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

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
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
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


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const dashboard26Demo: Dashboard26Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Dashboard26Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
          {heading}
        </span>
        <div className="relative flex items-center justify-between">
          <span
            className="absolute inset-x-2 top-2.5 h-0.5 bg-current/10"
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
                        : "bg-current/10 text-current/60"
                  )}
                  aria-hidden="true"
                >
                  {done ? <Check className="size-3" /> : i + 1}
                </span>
                <span
                  className={cn(
                    "text-xs",
                    active
                      ? "font-semibold"
                      : "text-current/60"
                  )}
                >
                  {s.label}
                </span>
                {s.date && (
                  <span className="font-mono text-xs text-current/60">
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
