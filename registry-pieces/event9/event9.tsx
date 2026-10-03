"use client";

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
  bordered?: boolean;
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
  viewers: "2,148 watching",
  liveLabel: "Live",
  action: "Join the stream",
  tone: "neutral",
  bordered: false,
};

export function Event9({
  title,
  host,
  viewers,
  minutesIn,
  liveLabel = "Live",
  action = "Join the stream",
  tone = "neutral",
  bordered = false,
  className,
}: Event9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500 px-2 py-0.5 text-xs font-bold text-white">
            <span
              className="size-1.5 animate-pulse rounded-full bg-white"
              aria-hidden="true"
            />
            {liveLabel}
          </span>
          {minutesIn && (
            <span className="text-xs text-muted-foreground">
              {minutesIn}
            </span>
          )}
          {viewers && (
            <span className="ml-auto text-xs tabular-nums text-muted-foreground">
              {viewers}
            </span>
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
