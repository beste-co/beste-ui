"use client";

import { Radio } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "sunset"
  | "ocean"
  | "emerald"
  | "violet"
  | "rose";

interface Event9Props {
  title?: string;
  host?: string;
  viewers?: string;
  minutesIn?: string;
  liveLabel?: string;
  action?: string;
  tone?: Tone;
  className?: string;
}

const actionClasses: Record<Tone, string> = {
  neutral: "bg-foreground text-background",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sunset: "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
  ocean: "bg-gradient-to-r from-sky-500 to-indigo-500 text-white",
  emerald: "bg-emerald-500 text-white",
  violet: "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white",
  rose: "bg-rose-500 text-white",
};

export const event9Demo: Event9Props = {
  title: "Shipping in public · weekly",
  host: "Hosted by Beste Sözen",
  viewers: "2,148 watching",
  minutesIn: "14 min in",
  liveLabel: "Live",
  action: "Join the stream",
  tone: "neutral",
};

export function Event9({
  title,
  host,
  viewers,
  minutesIn,
  liveLabel = "Live",
  action = "Join the stream",
  tone = "neutral",
  className,
}: Event9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
            <span
              className="size-1.5 animate-pulse rounded-full bg-white"
              aria-hidden="true"
            />
            {liveLabel}
          </span>
          {minutesIn && (
            <span className="font-mono text-xs text-muted-foreground">
              {minutesIn}
            </span>
          )}
          {viewers && (
            <div className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Radio className="size-3" aria-hidden="true" />
              {viewers}
            </div>
          )}
        </div>
        {title && (
          <span className="text-sm font-semibold leading-snug text-card-foreground">
            {title}
          </span>
        )}
        {host && (
          <span className="text-sm italic text-muted-foreground">{host}</span>
        )}
        <button
          type="button"
          className={cn(
            "self-start rounded-md px-3 py-1.5 text-sm font-semibold hover:opacity-90",
            actionClasses[tone]
          )}
        >
          {action}
        </button>
      </div>
    </div>
  );
}
