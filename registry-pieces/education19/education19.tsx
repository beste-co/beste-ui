"use client";

import { Hand, Mic, Users, Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface Education19Props {
  title?: string;
  attendees?: number;
  raisedHands?: number;
  micOn?: boolean;
  durationSoFar?: string;
  bordered?: boolean;
  className?: string;
}

export const education19Demo: Education19Props = {
  title: "TypeScript generics",
  attendees: 142,
  micOn: false,
  bordered: false,
};

export function Education19({
  title,
  attendees = 0,
  raisedHands,
  micOn = false,
  durationSoFar,
  bordered = false,
  className,
}: Education19Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-foreground p-3 text-background shadow-md", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold">
            <span
              className="size-1.5 animate-pulse rounded-full bg-white"
              aria-hidden="true"
            />
            Live
          </span>
          {durationSoFar && (
            <span className="text-xs text-background/70">
              {durationSoFar}
            </span>
          )}
        </div>
        {title && (
          <span className="text-sm font-semibold">{title}</span>
        )}
        <div className="flex items-center justify-between rounded-lg bg-background/10 p-2 text-xs">
          <div className="flex items-center gap-3 tabular-nums">
            <span className="inline-flex items-center gap-1">
              <Users className="size-3.5" aria-hidden="true" />
              {attendees}
            </span>
            {raisedHands != null && (
              <span className="inline-flex items-center gap-1 text-amber-300">
                <Hand className="size-3.5" aria-hidden="true" />
                {raisedHands}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className={cn(
                "flex size-7 items-center justify-center rounded-full",
                micOn
                  ? "bg-emerald-500 text-white"
                  : "bg-rose-500 text-white"
              )}
              aria-label={micOn ? "Mute" : "Unmute"}
            >
              <Mic className="size-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="flex size-7 items-center justify-center rounded-full bg-background/15"
              aria-label="Toggle video"
            >
              <Video className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
