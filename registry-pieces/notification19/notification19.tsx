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

const iconClasses: Record<Tone, string> = {
  primary: "text-primary",
  emerald: "text-emerald-600",
  amber: "text-amber-600",
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
  bordered: false,
  inverted: false,
  title: "New booking confirmed",
  meta: "Max Richter at 09:00",
  tone: "primary",
};

export function Notification19({
  icon: Icon = Bell,
  title = "Notification",
  meta,
  time,
  tone = "primary",
  surface = "card",
  bordered = false,
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
        <Icon
          className={cn("size-5 shrink-0", iconClasses[tone])}
          aria-hidden="true"
        />
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
