"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber"
  | "rose";

interface Dashboard17Props {
  label?: string;
  value?: string;
  rate?: string;
  tone?: Tone;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const pingClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

const textClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  violet: "text-violet-600 dark:text-violet-400",
  emerald: "text-emerald-600 dark:text-emerald-400",
  sky: "text-sky-600 dark:text-sky-400",
  amber: "text-amber-600 dark:text-amber-400",
  rose: "text-rose-600 dark:text-rose-400",
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

export const dashboard17Demo: Dashboard17Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  label: "Live requests",
  value: "2,418",
  rate: "+24 / sec",
  tone: "emerald",
};

export function Dashboard17({
  label = "Live",
  value = "0",
  rate,
  tone = "emerald",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Dashboard17Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-64 flex-col gap-1 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center gap-1.5">
          <span className="relative flex size-2" aria-hidden="true">
            <span
              className={cn(
                "absolute inset-0 animate-ping rounded-full opacity-60",
                pingClasses[tone]
              )}
            />
            <span
              className={cn("relative size-2 rounded-full", pingClasses[tone])}
            />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
            {label}
          </span>
        </div>
        <span className="font-mono text-2xl font-semibold tabular-nums">
          {value}
        </span>
        {rate && (
          <span
            className={cn(
              "font-mono text-xs font-medium tabular-nums",
              textClasses[tone]
            )}
          >
            {rate}
          </span>
        )}
      </div>
    </div>
  );
}
