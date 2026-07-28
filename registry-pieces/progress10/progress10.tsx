"use client";

import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "sunset"
  | "rose"
  | "amber"
  | "emerald";

interface Progress10Props {
  streak?: number;
  label?: string;
  longest?: number;
  longestLabel?: string;
  longestSuffix?: string;
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground shadow-md",
  foreground: "bg-foreground text-background shadow-md",
  sunset:
    "bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-md shadow-orange-500/30",
  rose: "bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/30",
  amber:
    "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-amber-500/30",
  emerald:
    "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30",
};

export const progress10Demo: Progress10Props = {
  streak: 27,
  longest: 42,
  longestLabel: "Longest",
  longestSuffix: "days",
  label: "Day streak",
  tone: "emerald",
};

export function Progress10({
  streak = 0,
  label,
  longest,
  longestLabel = "Longest",
  longestSuffix = "days",
  tone = "sunset",
  className,
}: Progress10Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full max-w-60 items-center gap-3 rounded-xl px-4 py-3",
          toneClasses[tone]
        )}
      >
        <Flame className="size-10 shrink-0 fill-white/30" aria-hidden="true" />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold tabular-nums leading-none">
              {streak}
            </span>
            {label && (
              <span className="text-xs font-semibold uppercase tracking-wide opacity-80">
                {label}
              </span>
            )}
          </div>
          {typeof longest === "number" && (
            <span className="text-xs opacity-80">
              {longestLabel}:{" "}
              <span className="font-semibold">
                {longest} {longestSuffix}
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
