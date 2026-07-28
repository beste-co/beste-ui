"use client";

import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "rose" | "emerald" | "amber" | "sky";

interface Notification17Props {
  count?: number;
  label?: string;
  pinging?: boolean;
  tone?: Tone;
  className?: string;
}

const badgeClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  rose: "bg-rose-500 text-white",
  emerald: "bg-emerald-500 text-white",
  amber: "bg-amber-500 text-white",
  sky: "bg-sky-500 text-white",
};

const pingClasses: Record<Tone, string> = {
  primary: "bg-primary/40",
  foreground: "bg-foreground/40",
  rose: "bg-rose-500/40",
  emerald: "bg-emerald-500/40",
  amber: "bg-amber-500/40",
  sky: "bg-sky-500/40",
};

export const notification17Demo: Notification17Props = {
  count: 12,
  label: "Notifications",
  pinging: true,
  tone: "rose",
};

export function Notification17({
  count = 0,
  label = "Notifications",
  pinging = true,
  tone = "rose",
  className,
}: Notification17Props) {
  const display = count > 99 ? "99+" : String(count);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex items-center gap-3 rounded-full border border-border bg-card px-3 py-2 shadow-sm">
        <div className="relative">
          <Bell className="size-5 text-card-foreground" aria-hidden="true" />
          {count > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex items-center justify-center">
              {pinging && (
                <span
                  className={cn(
                    "absolute inline-flex size-full animate-ping rounded-full",
                    pingClasses[tone]
                  )}
                  aria-hidden="true"
                />
              )}
              <span
                className={cn(
                  "relative flex min-w-4 items-center justify-center rounded-full px-1 py-0.5 text-xs font-bold leading-none",
                  badgeClasses[tone]
                )}
              >
                {display}
              </span>
            </span>
          )}
        </div>
        <span className="text-sm font-medium text-card-foreground">
          {label}
        </span>
      </div>
    </div>
  );
}
