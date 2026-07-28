"use client";

import { Calendar, Users, Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification12Props {
  title?: string;
  time?: string;
  location?: string;
  attendees?: number;
  startsIn?: string;
  className?: string;
}

export const notification12Demo: Notification12Props = {
  title: "Weekly product sync",
  time: "Today, 14:00 – 14:30",
  location: "Google Meet",
  attendees: 6,
  startsIn: "in 10 min",
};

export function Notification12({
  title,
  time,
  location,
  attendees,
  startsIn,
  className,
}: Notification12Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2.5 rounded-lg border border-border bg-card p-3 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 flex-col items-center justify-center rounded-lg bg-sky-500/10 text-sky-700 dark:text-sky-400">
            <Calendar className="size-4" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {title && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {title}
              </span>
            )}
            {time && (
              <span className="truncate text-xs text-muted-foreground">
                {time}
              </span>
            )}
          </div>
          {startsIn && (
            <span className="shrink-0 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
              {startsIn}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 border-t border-border pt-2 text-xs text-muted-foreground">
          {location && (
            <span className="inline-flex items-center gap-1">
              <Video className="size-3.5" aria-hidden="true" />
              {location}
            </span>
          )}
          {typeof attendees === "number" && (
            <span className="inline-flex items-center gap-1">
              <Users className="size-3.5" aria-hidden="true" />
              {attendees}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
