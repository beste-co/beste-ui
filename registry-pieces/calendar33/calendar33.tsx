"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "emerald" | "sky" | "violet";

interface DayCell {
  weekday: string;
  date: string;
}

interface Calendar33Props {
  title?: string;
  days?: DayCell[];
  slots?: string[];
  startIndex?: number;
  pickIndex?: number;
  pickSlot?: number;
  holdMs?: number;
  tone?: Tone;
  className?: string;
}

const fillClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  emerald: "bg-emerald-500 text-white",
  sky: "bg-sky-500 text-white",
  violet: "bg-violet-500 text-white",
};

const onFillClasses: Record<Tone, string> = {
  primary: "text-primary-foreground",
  foreground: "text-background",
  emerald: "text-white",
  sky: "text-white",
  violet: "text-white",
};

const STEP_MS = [900, 1000, 1000];

export const calendar33Demo: Calendar33Props = {
  title: "Book a session",
  days: [
    { weekday: "Mon", date: "12" },
    { weekday: "Tue", date: "13" },
    { weekday: "Wed", date: "14" },
    { weekday: "Thu", date: "15" },
    { weekday: "Fri", date: "16" },
    { weekday: "Sat", date: "17" },
    { weekday: "Sun", date: "18" },
  ],
  slots: ["09:00", "11:30", "14:00"],
  startIndex: 1,
  pickIndex: 3,
  pickSlot: 1,
  tone: "primary",
};

export function Calendar33({
  title = "Pick a time",
  days = [],
  slots = [],
  startIndex = 0,
  pickIndex = 3,
  pickSlot = 1,
  holdMs = 2600,
  tone = "primary",
  className,
}: Calendar33Props) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setTimeout(
      () => setStep((s) => (s + 1) % 4),
      step === 3 ? holdMs : STEP_MS[step]
    );
    return () => clearTimeout(id);
  }, [step, holdMs]);

  const dayIndex = step === 0 ? startIndex : pickIndex;
  const slotChosen = step >= 2;
  const confirmed = step === 3;
  const day = days[pickIndex];
  const slot = slots[pickSlot];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes calendar33-in { from { opacity: 0; transform: translateY(0.25rem); } to { opacity: 1; transform: none; } }`}</style>
      <div className="flex w-full max-w-80 flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <p className="text-sm font-medium text-card-foreground">{title}</p>

        <div className="relative grid grid-cols-7">
          <span
            className={cn(
              "absolute inset-y-0 rounded-lg transition-all duration-500 ease-in-out motion-reduce:transition-none",
              fillClasses[tone]
            )}
            style={{ left: `${(dayIndex * 100) / days.length}%`, width: `${100 / days.length}%` }}
            aria-hidden="true"
          />
          {days.map((d, i) => {
            const selected = i === dayIndex;
            return (
              <div
                key={i}
                className={cn(
                  "relative z-10 flex flex-col items-center gap-0.5 py-2 transition-colors duration-300",
                  selected ? onFillClasses[tone] : "text-card-foreground"
                )}
              >
                <span className={cn("text-xs", selected ? "opacity-80" : "text-muted-foreground")}>
                  {d.weekday}
                </span>
                <span className="text-sm font-medium tabular-nums">{d.date}</span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {slots.map((s, i) => {
            const active = slotChosen && i === pickSlot;
            return (
              <button
                key={i}
                type="button"
                className={cn(
                  "flex h-8 cursor-pointer items-center justify-center rounded-md border text-sm tabular-nums transition-all duration-300 ease-out",
                  active
                    ? cn("border-transparent shadow-sm", fillClasses[tone])
                    : "border-border bg-card text-card-foreground hover:bg-muted"
                )}
              >
                {s}
              </button>
            );
          })}
        </div>

        <div className="flex h-7 items-center">
          {confirmed && day ? (
            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 motion-reduce:animate-none dark:text-emerald-400"
              style={{ animation: "calendar33-in 400ms ease-out" }}
            >
              <Check className="size-3.5" aria-hidden="true" />
              Confirmed, {day.weekday} {day.date} at {slot}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">
              {slotChosen ? "Checking availability" : "Pick a day, then a time"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
