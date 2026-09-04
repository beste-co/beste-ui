"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "scanning" | "confirming" | "booked";

interface Calendar34Props {
  dayLabel?: string;
  timezone?: string;
  slots?: string[];
  pickIndex?: number;
  stepMs?: number;
  holdMs?: number;
  className?: string;
}

export const calendar34Demo: Calendar34Props = {
  dayLabel: "Thursday, 12 October",
  timezone: "Europe/Lisbon",
  slots: ["09:00", "10:30", "13:00", "15:30"],
  pickIndex: 2,
};

export function Calendar34({
  dayLabel = "Today",
  timezone,
  slots = [],
  pickIndex = 0,
  stepMs = 700,
  holdMs = 2400,
  className,
}: Calendar34Props) {
  const [phase, setPhase] = useState<Phase>("scanning");
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    if (phase === "scanning") {
      if (cursor >= pickIndex) {
        const id = setTimeout(() => setPhase("confirming"), stepMs);
        return () => clearTimeout(id);
      }
      const id = setTimeout(() => setCursor((c) => c + 1), stepMs);
      return () => clearTimeout(id);
    }
    if (phase === "confirming") {
      const id = setTimeout(() => setPhase("booked"), 900);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setCursor(0);
      setPhase("scanning");
    }, holdMs);
    return () => clearTimeout(id);
  }, [phase, cursor, pickIndex, stepMs, holdMs]);

  const selected = phase !== "scanning";

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`
@keyframes calendar34-in { from { opacity: 0; transform: translateY(0.375rem); } to { opacity: 1; transform: none; } }
`}</style>

      <div className="flex w-full max-w-64 flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <CalendarDays
            className="size-4 text-muted-foreground"
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-card-foreground">
              {dayLabel}
            </p>
            {timezone && (
              <p className="text-xs text-muted-foreground">{timezone}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {slots.map((slot, i) => {
            const isPick = i === pickIndex;
            const active = phase === "scanning" ? i === cursor : isPick;
            return (
              <button
                key={slot}
                type="button"
                className={cn(
                  "cursor-pointer rounded-lg border px-2 py-1.5 text-sm tabular-nums transition-colors duration-300 motion-reduce:transition-none",
                  selected && isPick
                    ? "border-foreground bg-foreground text-background"
                    : active
                      ? "border-foreground bg-card text-card-foreground"
                      : "border-border bg-card text-muted-foreground"
                )}
              >
                {slot}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className={cn(
            "flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition-colors duration-300 motion-reduce:transition-none",
            phase === "booked"
              ? "bg-emerald-500 text-white"
              : "bg-foreground text-background"
          )}
        >
          {phase === "scanning" && "Pick a time"}
          {phase === "confirming" && (
            <>
              <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
              Booking
            </>
          )}
          {phase === "booked" && (
            <span
              className="flex items-center gap-1.5"
              style={{ animation: "calendar34-in 350ms ease-out" }}
            >
              <Check className="size-4" aria-hidden="true" />
              Booked for {slots[pickIndex]}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
