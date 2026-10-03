"use client";

import { DoorOpen } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Tone =
  | "primary"
  | "foreground"
  | "sky"
  | "emerald"
  | "violet"
  | "amber"
  | "rose";

interface Realestate3Props {
  title?: string;
  when?: string;
  rsvpCount?: number;
  hostedBy?: string;
  label?: string;
  tone?: Tone;
  rsvpsSuffix?: string;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-current",
  sky: "text-sky-500",
  emerald: "text-emerald-500",
  violet: "text-violet-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
};

const labelClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-700 dark:text-sky-300",
  emerald: "text-emerald-700 dark:text-emerald-300",
  violet: "text-violet-700 dark:text-violet-300",
  amber: "text-amber-700 dark:text-amber-300",
  rose: "text-rose-700 dark:text-rose-300",
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

export const realestate3Demo: Realestate3Props = {
  surface: "card",
  bordered: false,
  inverted: false,
  title: "Open house · 221B Riverside",
  when: "Sat, May 4 · 11:00 – 14:00",
  rsvpCount: 18,
  tone: "primary",
  rsvpsSuffix: "RSVPs",
};

export function Realestate3({
  title,
  when,
  rsvpCount = 0,
  hostedBy,
  label,
  tone = "primary",
  rsvpsSuffix = "RSVPs",
  surface = "card",
  bordered = false,
  inverted = false,
  className,
}: Realestate3Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center gap-2">
          <DoorOpen
            className={cn("size-5 shrink-0", iconClasses[tone])}
            aria-hidden="true"
          />
          {label && (
            <span
              className={cn(
                "text-xs font-semibold",
                labelClasses[tone]
              )}
            >
              {label}
            </span>
          )}
        </div>
        {title && (
          <span className="text-sm font-semibold">
            {title}
          </span>
        )}
        <div className="flex items-center justify-between gap-3 text-xs text-current/60">
          {when && <span>{when}</span>}
          <span className="tabular-nums">
            {rsvpCount} {rsvpsSuffix}
          </span>
        </div>
        {hostedBy && (
          <span className="border-t border-current/15 pt-2 text-sm italic text-current/60">
            {hostedBy}
          </span>
        )}
      </div>
    </div>
  );
}
