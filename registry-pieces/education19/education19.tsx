"use client";

import { Hand, Mic, Users, Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface Education19Props {
  title?: string;
  attendees?: number;
  raisedHands?: number;
  micOn?: boolean;
  durationSoFar?: string;
  className?: string;
}

export const education19Demo: Education19Props = {
  title: "Live class · Typescript generics",
  attendees: 142,
  raisedHands: 3,
  micOn: false,
  durationSoFar: "42:18 into class",
};

export function Education19({
  title,
  attendees = 0,
  raisedHands = 0,
  micOn = false,
  durationSoFar,
  className,
}: Education19Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-foreground p-3 text-background shadow-md">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold">
            <span
              className="size-1.5 animate-pulse rounded-full bg-white"
              aria-hidden="true"
            />
            Live
          </span>
          {durationSoFar && (
            <span className="text-xs font-mono text-background/70">
              {durationSoFar}
            </span>
          )}
        </div>
        {title && (
          <span className="text-sm font-semibold">{title}</span>
        )}
        <div className="flex items-center justify-between rounded-lg bg-background/10 p-2 text-xs">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <Users className="size-3.5" aria-hidden="true" />
              {attendees}
            </span>
            <span className="inline-flex items-center gap-1 text-amber-300">
              <Hand className="size-3.5" aria-hidden="true" />
              {raisedHands}
            </span>
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
