"use client";

import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "rose"
  | "amber"
  | "sky"
  | "emerald"
  | "violet";

interface Monitoring3Props {
  label?: string;
  title?: string;
  service?: string;
  time?: string;
  tone?: Tone;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  neutral: "text-current/60",
  primary: "text-primary",
  foreground: "text-foreground",
  rose: "text-rose-500",
  amber: "text-amber-500",
  sky: "text-sky-500",
  emerald: "text-emerald-500",
  violet: "text-violet-500",
};

const tagClasses: Record<Tone, string> = {
  neutral: "border-current/15 bg-current/10 text-foreground",
  primary: "border-primary/20 bg-primary/10 text-primary",
  foreground: "border-foreground/20 bg-current/10 text-foreground",
  rose: "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400",
  amber:
    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  sky: "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-400",
  emerald:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  violet:
    "border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-400",
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

export const monitoring3Demo: Monitoring3Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  label: "Critical",
  title: "5xx error rate above 2%",
  service: "checkout-api",
  time: "2m ago",
  tone: "rose",
};

export function Monitoring3({
  label = "Alert",
  title = "Incident triggered",
  service,
  time,
  tone = "rose",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Monitoring3Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 items-start gap-3 rounded-lg p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <Bell
          className={cn("mt-0.5 size-4 shrink-0", iconClasses[tone])}
          aria-hidden="true"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide",
                tagClasses[tone]
              )}
            >
              {label}
            </span>
            {time && (
              <span className="text-xs tabular-nums text-current/60">
                {time}
              </span>
            )}
          </div>
          <p className="text-sm font-medium leading-snug">
            {title}
          </p>
          {service && (
            <p className="font-mono text-xs text-current/60">
              {service}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
