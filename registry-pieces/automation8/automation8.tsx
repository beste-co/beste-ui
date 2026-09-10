"use client";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber";

interface Automation8Props {
  name?: string;
  description?: string;
  image?: string;
  alt?: string;
  active?: boolean;
  runsToday?: number;
  activeLabel?: string;
  pausedLabel?: string;
  runsLabel?: string;
  tone?: Tone;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const switchOnClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  amber: "bg-amber-500",
};

const switchTextOn: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  violet: "text-violet-600 dark:text-violet-400",
  emerald: "text-emerald-600 dark:text-emerald-400",
  sky: "text-sky-600 dark:text-sky-400",
  amber: "text-amber-600 dark:text-amber-400",
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

export const automation8Demo: Automation8Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  name: "Stripe → Slack revenue alerts",
  description: "Posts a message in #revenue when a payment over $500 lands.",
  image: "https://oud.pics/sm/l/stripe.jpeg",
  alt: "Stripe",
  active: true,
  runsToday: 28,
  activeLabel: "Active",
  pausedLabel: "Paused",
  runsLabel: "runs today",
  tone: "emerald",
};

export function Automation8({
  name = "Workflow",
  description,
  image,
  alt,
  active = false,
  runsToday,
  activeLabel = "Active",
  pausedLabel = "Paused",
  runsLabel = "runs today",
  tone = "emerald",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Automation8Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 items-start gap-2.5 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        {image ? (
          <span className="relative size-8 shrink-0 overflow-hidden rounded-md bg-current/10">
            <img
              src={image}
              alt={alt ?? name}
              className="absolute inset-0 size-full object-cover"
            />
          </span>
        ) : (
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400"
            aria-hidden="true"
          >
            <Zap className="size-4" />
          </span>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-xs font-semibold">
              {name}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={active}
              className={cn(
                "relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors",
                active ? switchOnClasses[tone] : "bg-current/10"
              )}
            >
              <span
                className={cn(
                  "inline-block size-3 rounded-full bg-white shadow transition-transform",
                  active ? "translate-x-3.5" : "translate-x-0.5"
                )}
                aria-hidden="true"
              />
            </button>
          </div>
          {description && (
            <p className="line-clamp-2 text-xs leading-snug text-current/60">
              {description}
            </p>
          )}
          <div className="flex items-center justify-between pt-1 text-xs">
            <span
              className={cn(
                "font-medium",
                active ? switchTextOn[tone] : "text-current/60"
              )}
            >
              {active ? activeLabel : pausedLabel}
            </span>
            {typeof runsToday === "number" && (
              <span className="font-mono tabular-nums text-current/60">
                {runsToday} {runsLabel}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
