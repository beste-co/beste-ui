"use client";

import { Calendar, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "received" | "sent";

interface Chat12Props {
  title?: string;
  date?: string;
  time?: string;
  attendees?: number;
  role?: Role;
  className?: string;
}

export const chat12Demo: Chat12Props = {
  title: "Q2 Planning Kickoff",
  date: "Mon, Apr 28",
  time: "10:00 – 11:30",
  attendees: 6,
  role: "received",
};

export function Chat12({
  title = "Meeting",
  date,
  time,
  attendees,
  role = "received",
  className,
}: Chat12Props) {
  const isSent = role === "sent";

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex w-64 flex-col gap-2 rounded-2xl px-3 py-2.5 shadow-sm",
          isSent
            ? "ml-auto rounded-br-md bg-primary text-primary-foreground"
            : "mr-auto rounded-bl-md bg-muted text-card-foreground"
        )}
      >
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-md",
              isSent ? "bg-primary-foreground/20" : "bg-card"
            )}
          >
            <Calendar className="size-4" aria-hidden="true" />
          </div>
          <span className="truncate text-sm font-semibold">{title}</span>
        </div>
        <div className="flex flex-col gap-0.5 text-xs">
          {date && (
            <div
              className={cn(
                "flex items-center gap-1.5",
                isSent ? "text-primary-foreground/80" : "text-muted-foreground"
              )}
            >
              <Calendar className="size-3" aria-hidden="true" />
              <span>{date}</span>
            </div>
          )}
          {time && (
            <div
              className={cn(
                "flex items-center gap-1.5 tabular-nums",
                isSent ? "text-primary-foreground/80" : "text-muted-foreground"
              )}
            >
              <Clock className="size-3" aria-hidden="true" />
              <span>{time}</span>
            </div>
          )}
          {typeof attendees === "number" && (
            <div
              className={cn(
                "flex items-center gap-1.5",
                isSent ? "text-primary-foreground/80" : "text-muted-foreground"
              )}
            >
              <Users className="size-3" aria-hidden="true" />
              <span>{attendees} going</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 pt-0.5">
          <button
            type="button"
            className={cn(
              "flex-1 rounded-md px-2 py-1 text-xs font-semibold transition-colors",
              isSent
                ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                : "bg-foreground text-background hover:bg-foreground/90"
            )}
          >
            Join
          </button>
          <button
            type="button"
            className={cn(
              "rounded-md px-2 py-1 text-xs font-medium transition-colors",
              isSent
                ? "text-primary-foreground/80 hover:bg-primary-foreground/10"
                : "text-muted-foreground hover:bg-card-foreground/5"
            )}
          >
            Maybe
          </button>
        </div>
      </div>
    </div>
  );
}
