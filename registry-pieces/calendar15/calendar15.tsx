"use client";

import { cn } from "@/lib/utils";

interface Slot {
  from: string;
  to: string;
  label: string;
  tone: "sky" | "emerald" | "violet" | "amber" | "rose";
}

interface Calendar15Props {
  heading?: string;
  slots?: Slot[];
  className?: string;
}

const toneClasses: Record<Slot["tone"], string> = {
  sky: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  emerald: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  violet: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  amber: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  rose: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
};

export const calendar15Demo: Calendar15Props = {
  heading: "Thursday · 23 Apr",
  slots: [
    { from: "09:00", to: "10:00", label: "Focus block · Design review", tone: "sky" },
    { from: "10:30", to: "11:00", label: "1:1 with Mira", tone: "emerald" },
    { from: "13:00", to: "14:30", label: "Sprint planning", tone: "violet" },
    { from: "16:00", to: "16:30", label: "Coffee with Jules", tone: "amber" },
  ],
};

export function Calendar15({
  heading,
  slots = [],
  className,
}: Calendar15Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        {heading && (
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {heading}
          </span>
        )}
        <div className="flex flex-col gap-1.5">
          {slots.map((slot, idx) => (
            <div
              key={idx}
              className={cn(
                "flex items-center gap-3 rounded-md px-2.5 py-1.5 text-sm",
                toneClasses[slot.tone]
              )}
            >
              <div className="flex shrink-0 flex-col items-start font-mono">
                <span className="text-sm font-semibold">{slot.from}</span>
                <span className="text-xs opacity-70">{slot.to}</span>
              </div>
              <span className="flex-1 truncate font-medium text-card-foreground">
                {slot.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
