"use client";

import { Bell, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Tone = "primary" | "emerald" | "amber";

interface Notification19Props {
  icon?: LucideIcon;
  title?: string;
  meta?: string;
  time?: string;
  tone?: Tone;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const chipStyles: Record<Tone, string> = {
  primary: "bg-primary/10 text-primary",
  emerald: "bg-emerald-500/10 text-emerald-600",
  amber: "bg-amber-500/10 text-amber-600",
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

export const notification19Demo: Notification19Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Notification19Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 items-center gap-3 rounded-md p-3 shadow-xl", surfaceTone, bordered && "border border-current/15")}>
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
          <p className="truncate text-sm font-medium">
            {title}
          </p>
          {meta && (
            <p className="truncate text-sm text-current/60">{meta}</p>
          )}
        </div>
        {time && (
          <span className="shrink-0 text-xs text-current/60">{time}</span>
        )}
      </div>
    </div>
  );
}
