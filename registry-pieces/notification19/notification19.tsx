"use client";

import { Bell, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "emerald" | "amber";

interface Notification19Props {
  icon?: LucideIcon;
  title?: string;
  meta?: string;
  time?: string;
  tone?: Tone;
  className?: string;
}

const chipStyles: Record<Tone, string> = {
  primary: "bg-primary/10 text-primary",
  emerald: "bg-emerald-500/10 text-emerald-600",
  amber: "bg-amber-500/10 text-amber-600",
};

export const notification19Demo: Notification19Props = {
  title: "New booking confirmed",
  meta: "Rowan Blake · 09:00",
  time: "now",
  tone: "emerald",
};

export function Notification19({
  icon: Icon = Bell,
  title = "Notification",
  meta,
  time,
  tone = "primary",
  className,
}: Notification19Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-3 rounded-md border border-border bg-card p-3 shadow-xl">
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-md",
            chipStyles[tone]
          )}
          aria-hidden="true"
        >
          <Icon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-card-foreground">
            {title}
          </p>
          {meta && (
            <p className="truncate text-sm text-muted-foreground">{meta}</p>
          )}
        </div>
        {time && (
          <span className="shrink-0 text-xs text-muted-foreground">{time}</span>
        )}
      </div>
    </div>
  );
}
