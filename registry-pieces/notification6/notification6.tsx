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
  bordered?: boolean;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  sunset: "text-rose-500",
  emerald: "text-emerald-500",
  violet: "text-violet-500",
  amber: "text-amber-500",
};

export const notification6Demo: Notification6Props = {
  title: "Achievement unlocked",
  description: "Shipped 10 pull requests this week",
  xp: "+250 XP",
  tone: "sunset",
  bordered: false,
};

export function Notification6({
  title,
  description,
  xp,
  tone = "sunset",
  bordered = false,
  className,
}: Notification6Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 items-center gap-3 overflow-hidden rounded-xl bg-card p-3 shadow-lg", bordered && "border border-border")}>
        <Trophy
          className={cn("size-6 shrink-0", iconClasses[tone])}
          aria-hidden="true"
        />
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
