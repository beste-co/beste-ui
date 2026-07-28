"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "emerald"
  | "sky"
  | "violet"
  | "amber"
  | "rose";

interface Card12Props {
  name?: string;
  price?: string;
  period?: string;
  tagline?: string;
  features?: string[];
  action?: string;
  tone?: Tone;
  className?: string;
}

const borderClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  emerald: "bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-500",
  sky: "bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-500",
  violet: "bg-gradient-to-br from-violet-500 via-fuchsia-500 to-rose-500",
  amber: "bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500",
  rose: "bg-gradient-to-br from-rose-500 via-pink-500 to-orange-500",
};

const labelClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  emerald: "text-emerald-600 dark:text-emerald-400",
  sky: "text-sky-600 dark:text-sky-400",
  violet: "text-violet-600 dark:text-violet-400",
  amber: "text-amber-600 dark:text-amber-400",
  rose: "text-rose-600 dark:text-rose-400",
};

const checkClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  emerald: "text-emerald-500",
  sky: "text-sky-500",
  violet: "text-violet-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
};

const actionClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  emerald: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
  sky: "bg-gradient-to-r from-sky-500 to-indigo-500 text-white",
  violet: "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white",
  amber: "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
  rose: "bg-gradient-to-r from-rose-500 to-pink-500 text-white",
};

export const card12Demo: Card12Props = {
  name: "Growth",
  price: "$48",
  period: "/ mo",
  tagline: "For teams growing past launch.",
  features: [
    "Unlimited editors",
    "250 GB storage",
    "Realtime analytics",
  ],
  action: "Start Growth",
  tone: "primary",
};

export function Card12({
  name,
  price,
  period = "/ mo",
  tagline,
  features = [],
  action,
  tone = "primary",
  className,
}: Card12Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "w-full max-w-64 rounded-xl p-px shadow-xl",
          borderClasses[tone]
        )}
      >
        <div className="flex flex-col gap-3 rounded-xl bg-card p-4">
          <div className="flex flex-col gap-1">
            {name && (
              <span
                className={cn(
                  "text-sm font-semibold uppercase tracking-wide",
                  labelClasses[tone]
                )}
              >
                {name}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-3xl font-bold text-card-foreground">
                {price}
              </span>
              <span className="text-sm text-muted-foreground">{period}</span>
            </div>
            {tagline && (
              <span className="text-sm text-muted-foreground">{tagline}</span>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            {features.map((f, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <Check
                  className={cn(
                    "mt-0.5 size-3.5 shrink-0",
                    checkClasses[tone]
                  )}
                  aria-hidden="true"
                />
                <span className="text-card-foreground">{f}</span>
              </div>
            ))}
          </div>
          {action && (
            <button
              type="button"
              className={cn(
                "rounded-md px-3 py-2 text-sm font-semibold shadow-md hover:opacity-90",
                actionClasses[tone]
              )}
            >
              {action}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
