"use client";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

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

export const automation8Demo: Automation8Props = {
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
  className,
}: Automation8Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-start gap-2.5 rounded-md border border-border bg-card p-3 shadow-sm">
        {image ? (
          <span className="relative size-8 shrink-0 overflow-hidden rounded-md bg-muted">
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
            <span className="truncate text-xs font-semibold text-card-foreground">
              {name}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={active}
              className={cn(
                "relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors",
                active ? switchOnClasses[tone] : "bg-muted-foreground/30"
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
            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
              {description}
            </p>
          )}
          <div className="flex items-center justify-between pt-1 text-xs">
            <span
              className={cn(
                "font-medium",
                active ? switchTextOn[tone] : "text-muted-foreground"
              )}
            >
              {active ? activeLabel : pausedLabel}
            </span>
            {typeof runsToday === "number" && (
              <span className="font-mono tabular-nums text-muted-foreground">
                {runsToday} {runsLabel}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
