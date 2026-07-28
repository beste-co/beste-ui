"use client";

import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "received" | "sent";

interface Chat27Props {
  transcript?: string;
  duration?: string;
  bars?: number[];
  role?: Role;
  className?: string;
}

export const chat27Demo: Chat27Props = {
  transcript:
    "Hey, jumping on a call in five. Can you pull up the latest Figma file?",
  duration: "0:09",
  bars: [45, 70, 55, 80, 35, 65, 90, 48, 72, 58],
  role: "received",
};

export function Chat27({
  transcript,
  duration = "0:00",
  bars = [],
  role = "received",
  className,
}: Chat27Props) {
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
          "flex max-w-72 flex-col gap-2 rounded-2xl px-3 py-2.5 shadow-sm",
          isSent
            ? "ml-auto rounded-br-md bg-primary text-primary-foreground"
            : "mr-auto rounded-bl-md bg-muted text-card-foreground"
        )}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Play voice note"
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-full shadow-sm",
              isSent ? "bg-primary-foreground/20" : "bg-card"
            )}
          >
            <Play
              className="size-3 translate-x-px fill-current"
              aria-hidden="true"
            />
          </button>
          <div
            className="flex h-5 flex-1 items-center gap-[2px]"
            aria-hidden="true"
          >
            {bars.map((h, i) => (
              <span
                key={i}
                className={cn(
                  "flex-1 rounded-full",
                  isSent ? "bg-primary-foreground/60" : "bg-card-foreground/40"
                )}
                style={{ height: `${Math.max(15, Math.min(100, h))}%` }}
              />
            ))}
          </div>
          <span
            className={cn(
              "shrink-0 font-mono text-xs tabular-nums",
              isSent ? "text-primary-foreground/80" : "text-muted-foreground"
            )}
          >
            {duration}
          </span>
        </div>
        {transcript && (
          <p
            className={cn(
              "border-t pt-2 text-xs italic leading-snug",
              isSent
                ? "border-primary-foreground/20 text-primary-foreground/80"
                : "border-border text-muted-foreground"
            )}
          >
            “{transcript}”
          </p>
        )}
      </div>
    </div>
  );
}
