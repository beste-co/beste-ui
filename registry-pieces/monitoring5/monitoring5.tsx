"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "emerald"
  | "sky"
  | "violet"
  | "amber"
  | "rose";

interface Monitoring5Props {
  label?: string;
  value?: number;
  unit?: string;
  tone?: Tone;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const arcClasses: Record<Tone, string> = {
  neutral: "text-current/60",
  primary: "text-primary",
  foreground: "text-foreground",
  emerald: "text-emerald-500",
  sky: "text-sky-500",
  violet: "text-violet-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
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

export const monitoring5Demo: Monitoring5Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  label: "Error budget",
  value: 82,
  unit: "%",
  tone: "rose",
};

export function Monitoring5({
  label = "SLO",
  value = 0,
  unit = "%",
  tone = "rose",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Monitoring5Props) {
  const safe = Math.min(100, Math.max(0, value));
  const radius = 36;
  const circumference = Math.PI * radius;
  const offset = circumference - (safe / 100) * circumference;

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-52 flex-col items-center gap-1 rounded-lg px-4 pb-3 pt-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <svg
          viewBox="0 0 100 56"
          className={cn("h-14 w-full", arcClasses[tone])}
          aria-hidden="true"
        >
          <path
            d="M 14 50 A 36 36 0 0 1 86 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            opacity={0.15}
          />
          <path
            d="M 14 50 A 36 36 0 0 1 86 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="-mt-3 flex flex-col items-center">
          <span className="text-2xl font-bold tabular-nums">
            {safe}
            <span className="text-sm font-medium text-current/60">
              {unit}
            </span>
          </span>
          <span className="text-xs uppercase tracking-wide text-current/60">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}
