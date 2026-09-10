"use client";

import { Check, CircleStop, TriangleAlert, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type IconKey = "check" | "stop" | "tool" | "warning";
type Tone =
  | "primary"
  | "foreground"
  | "emerald"
  | "sky"
  | "violet"
  | "amber"
  | "rose";

interface Ai14Props {
  label?: string;
  hint?: string;
  icon?: IconKey;
  tone?: Tone;
  tokens?: number;
  maxTokens?: number;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const iconMap: Record<IconKey, LucideIcon> = {
  check: Check,
  stop: CircleStop,
  tool: Wrench,
  warning: TriangleAlert,
};

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary/15 text-primary",
  foreground: "bg-current/15 text-foreground",
  emerald: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  sky: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  violet: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  amber: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  rose: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
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

export const ai14Demo: Ai14Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  label: "end_turn",
  hint: "Response completed normally.",
  icon: "check",
  tone: "emerald",
  tokens: 248,
  maxTokens: 1024,
};

export function Ai14({
  label = "end_turn",
  hint,
  icon = "check",
  tone = "emerald",
  tokens,
  maxTokens,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Ai14Props) {
  const Icon = iconMap[icon];

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 items-center gap-2.5 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-md",
            toneClasses[tone]
          )}
          aria-hidden="true"
        >
          <Icon className="size-4" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-baseline justify-between gap-2">
            <span className="truncate font-mono text-xs font-semibold">
              {label}
            </span>
            {typeof tokens === "number" && (
              <span className="shrink-0 font-mono text-xs tabular-nums text-current/60">
                {tokens.toLocaleString()}
                {typeof maxTokens === "number"
                  ? ` / ${maxTokens.toLocaleString()}`
                  : ""}
              </span>
            )}
          </div>
          {hint && (
            <span className="truncate text-xs text-current/60">
              {hint}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
