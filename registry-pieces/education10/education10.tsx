"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "violet"
  | "sky"
  | "emerald"
  | "amber"
  | "rose";

interface Education10Props {
  skill?: string;
  level?: number;
  xp?: number;
  nextLevelXp?: number;
  tone?: Tone;
  className?: string;
}

const tileClasses: Record<Tone, string> = {
  neutral: "bg-muted text-card-foreground",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  violet: "bg-violet-500 text-white",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
};

const levelPillClasses: Record<Tone, string> = {
  neutral: "bg-foreground text-background",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  violet: "bg-violet-500 text-white",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
};

const barClasses: Record<Tone, string> = {
  neutral: "bg-foreground",
  primary: "bg-primary",
  foreground: "bg-foreground",
  violet: "bg-gradient-to-r from-violet-500 to-fuchsia-500",
  sky: "bg-gradient-to-r from-sky-500 to-indigo-500",
  emerald: "bg-gradient-to-r from-emerald-500 to-teal-500",
  amber: "bg-gradient-to-r from-amber-500 to-orange-500",
  rose: "bg-gradient-to-r from-rose-500 to-pink-500",
};

export const education10Demo: Education10Props = {
  skill: "TypeScript",
  level: 7,
  xp: 4320,
  nextLevelXp: 5000,
  tone: "neutral",
};

export function Education10({
  skill,
  level = 1,
  xp = 0,
  nextLevelXp = 100,
  tone = "neutral",
  className,
}: Education10Props) {
  const pct = Math.max(
    0,
    Math.min(100, Math.round((xp / Math.max(1, nextLevelXp)) * 100))
  );
  const xpRemaining = Math.max(0, nextLevelXp - xp);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-lg border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-md",
              tileClasses[tone]
            )}
          >
            <Sparkles className="size-4" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold text-card-foreground">
              {skill}
            </span>
            <span className="text-xs text-muted-foreground">
              {xp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP
            </span>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-xs font-bold",
              levelPillClasses[tone]
            )}
          >
            Lv {level}
          </span>
        </div>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-muted"
          aria-hidden="true"
        >
          <div
            className={cn("h-full rounded-full", barClasses[tone])}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {xpRemaining.toLocaleString()} XP to Lv {level + 1}
        </span>
      </div>
    </div>
  );
}
