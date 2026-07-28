"use client";

import { Mic, MicOff, PhoneOff, Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface Chat6Props {
  name?: string;
  duration?: string;
  muted?: boolean;
  className?: string;
}

export const chat6Demo: Chat6Props = {
  name: "Ayşe Kaya",
  duration: "02:14",
  muted: false,
};

export function Chat6({
  name = "Caller",
  duration = "00:00",
  muted = false,
  className,
}: Chat6Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-3 rounded-full border border-emerald-500/40 bg-emerald-50 px-2 py-1.5 shadow-md dark:bg-emerald-950">
        <div className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
          <span
            className="absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-40"
            aria-hidden="true"
          />
          <Video className="relative size-4" aria-hidden="true" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col leading-tight">
          <span className="truncate text-sm font-semibold text-emerald-800 dark:text-emerald-100">
            On call with {name}
          </span>
          <span className="font-mono text-xs tabular-nums text-emerald-700/80 dark:text-emerald-200/70">
            {duration}
          </span>
        </div>
        <button
          type="button"
          aria-label={muted ? "Unmute" : "Mute"}
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 transition-colors hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-200"
        >
          {muted ? (
            <MicOff className="size-3.5" aria-hidden="true" />
          ) : (
            <Mic className="size-3.5" aria-hidden="true" />
          )}
        </button>
        <button
          type="button"
          aria-label="End call"
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white shadow-sm transition-colors hover:bg-rose-600"
        >
          <PhoneOff className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
