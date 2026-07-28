"use client";

import { Medal } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "primary" | "foreground" | "sky" | "emerald" | "violet" | "amber" | "rose";

interface Stat {
  label: string;
  value: string;
}

interface Fitness10Props {
  athlete?: string;
  tier?: string;
  initials?: string;
  stats?: Stat[];
  xp?: number;
  xpLabel?: string;
  image?: string;
  tone?: Tone;
  className?: string;
}

const avatarClasses: Record<Tone, string> = {
  neutral: "bg-foreground text-background",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-500 text-white",
  emerald: "bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-500 text-white",
  violet: "bg-gradient-to-br from-violet-500 via-fuchsia-500 to-rose-500 text-white",
  amber: "bg-gradient-to-br from-orange-500 via-amber-500 to-rose-500 text-white",
  rose: "bg-gradient-to-br from-rose-500 via-pink-500 to-orange-500 text-white",
};

const medalClasses: Record<Tone, string> = {
  neutral: "bg-foreground text-background",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  violet: "bg-violet-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
};

const tierClasses: Record<Tone, string> = {
  neutral: "text-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-700 dark:text-sky-300",
  emerald: "text-emerald-700 dark:text-emerald-300",
  violet: "text-violet-700 dark:text-violet-300",
  amber: "text-amber-700 dark:text-amber-300",
  rose: "text-rose-700 dark:text-rose-300",
};

const barClasses: Record<Tone, string> = {
  neutral: "bg-foreground",
  primary: "bg-primary",
  foreground: "bg-foreground",
  sky: "bg-sky-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

export const fitness10Demo: Fitness10Props = {
  athlete: "Beste Sözen",
  tier: "Silver · tier 4",
  initials: "BS",
  stats: [
    { label: "Sessions", value: "142" },
    { label: "Hours", value: "184h" },
    { label: "PRs", value: "12" },
  ],
  xp: 72,
  xpLabel: "% to gold",
  image:
    "https://images.unsplash.com/photo-1740510294148-2b8f82471496?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDI1fHx8ZW58MHx8fHx8",
  tone: "neutral",
};

export function Fitness10({
  athlete,
  tier,
  initials = "??",
  stats = [],
  xp = 0,
  xpLabel = "% to gold",
  image,
  tone = "neutral",
  className,
}: Fitness10Props) {
  const pct = Math.max(0, Math.min(100, xp));

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="flex w-full max-w-80 flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div
              className={cn(
                "relative flex size-11 items-center justify-center overflow-hidden rounded-full text-sm font-bold shadow-md",
                avatarClasses[tone]
              )}
            >
              {image ? (
                <img src={image} alt={athlete ?? ""} className="absolute inset-0 size-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <span
              className={cn(
                "absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full border-2 border-card",
                medalClasses[tone]
              )}
              aria-hidden="true"
            >
              <Medal className="size-2.5" aria-hidden="true" />
            </span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {athlete && (
              <span className="truncate text-sm font-semibold text-card-foreground">{athlete}</span>
            )}
            {tier && (
              <span className={cn("truncate text-xs font-medium", tierClasses[tone])}>{tier}</span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1 rounded-md bg-muted p-2 text-center">
          {stats.map((s, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="font-mono text-sm font-bold text-card-foreground">{s.value}</span>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted" aria-hidden="true">
            <div
              className={cn("h-full rounded-full", barClasses[tone])}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {pct}
            {xpLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
