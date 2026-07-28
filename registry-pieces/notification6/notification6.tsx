"use client";

import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "sunset"
  | "emerald"
  | "violet"
  | "amber";

interface Notification6Props {
  title?: string;
  description?: string;
  xp?: string;
  tone?: Tone;
  className?: string;
}

const tileClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sunset: "bg-gradient-to-br from-rose-500 to-orange-500 text-white",
  emerald: "bg-gradient-to-br from-emerald-500 to-teal-500 text-white",
  violet: "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white",
  amber: "bg-gradient-to-br from-amber-400 to-orange-500 text-white",
};

export const notification6Demo: Notification6Props = {
  title: "Achievement unlocked",
  description: "Shipped 10 pull requests this week",
  xp: "+250 XP",
  tone: "sunset",
};

export function Notification6({
  title,
  description,
  xp,
  tone = "sunset",
  className,
}: Notification6Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-3 overflow-hidden rounded-xl border border-border bg-card p-3 shadow-lg">
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl shadow-sm",
            tileClasses[tone]
          )}
        >
          <Trophy className="size-5" aria-hidden="true" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {title && (
            <span className="text-sm font-semibold text-card-foreground">
              {title}
            </span>
          )}
          {description && (
            <span className="text-xs text-muted-foreground">{description}</span>
          )}
        </div>
        {xp && (
          <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-bold text-card-foreground">
            {xp}
          </span>
        )}
      </div>
    </div>
  );
}
