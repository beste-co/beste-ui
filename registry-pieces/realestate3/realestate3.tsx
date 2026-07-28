"use client";

import { Calendar, DoorOpen, Users } from "lucide-react";
import { cn } from "@/lib/utils";

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
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  violet: "bg-violet-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
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

export const realestate3Demo: Realestate3Props = {
  title: "Open house · 221B Riverside",
  when: "Sat, May 4 · 11:00 – 14:00",
  rsvpCount: 18,
  hostedBy: "Hosted by Sofia Romano, Realtor",
  label: "Open house",
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
  className,
}: Realestate3Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-md",
              iconClasses[tone]
            )}
          >
            <DoorOpen className="size-4" aria-hidden="true" />
          </div>
          {label && (
            <span
              className={cn(
                "text-xs font-semibold uppercase tracking-wide",
                labelClasses[tone]
              )}
            >
              {label}
            </span>
          )}
        </div>
        {title && (
          <span className="text-sm font-semibold text-card-foreground">
            {title}
          </span>
        )}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3" aria-hidden="true" />
            {when}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="size-3" aria-hidden="true" />
            {rsvpCount} {rsvpsSuffix}
          </span>
        </div>
        {hostedBy && (
          <span className="border-t border-border pt-2 text-sm italic text-muted-foreground">
            {hostedBy}
          </span>
        )}
      </div>
    </div>
  );
}
