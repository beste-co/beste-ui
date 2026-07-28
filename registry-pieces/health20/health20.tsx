"use client";

import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "sky"
  | "emerald"
  | "violet"
  | "amber"
  | "rose";

interface Reminder {
  time: string;
  name: string;
  dose: string;
  taken?: boolean;
}

interface Health20Props {
  heading?: string;
  reminders?: Reminder[];
  tone?: Tone;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  neutral: "bg-muted text-foreground",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  violet: "bg-violet-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
};

export const health20Demo: Health20Props = {
  heading: "Medication · Today",
  reminders: [
    { time: "08:00", name: "Metformin", dose: "500 mg", taken: true },
    { time: "13:00", name: "Vitamin D", dose: "1000 IU", taken: true },
    { time: "19:30", name: "Lisinopril", dose: "10 mg" },
    { time: "22:00", name: "Atorvastatin", dose: "20 mg" },
  ],
  tone: "rose",
};

export function Health20({
  heading,
  reminders = [],
  tone = "rose",
  className,
}: Health20Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-7 items-center justify-center rounded-md",
              iconClasses[tone]
            )}
          >
            <Bell className="size-3.5" aria-hidden="true" />
          </div>
          {heading && (
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {heading}
            </span>
          )}
        </div>
        <div className="flex flex-col divide-y divide-border">
          {reminders.map((r, idx) => (
            <div
              key={idx}
              className={cn(
                "flex items-center gap-2 py-1.5 text-sm",
                r.taken && "opacity-70"
              )}
            >
              <span className="w-10 shrink-0 font-mono text-xs text-muted-foreground">
                {r.time}
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span
                  className={cn(
                    "truncate font-medium",
                    r.taken
                      ? "text-muted-foreground line-through"
                      : "text-card-foreground"
                  )}
                >
                  {r.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {r.dose}
                </span>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold",
                  r.taken
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {r.taken ? "Taken" : "Upcoming"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
