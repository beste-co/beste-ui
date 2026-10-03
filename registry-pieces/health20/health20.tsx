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
  bordered?: boolean;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  neutral: "text-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-500",
  emerald: "text-emerald-500",
  violet: "text-violet-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
};

export const health20Demo: Health20Props = {
  heading: "Medication",
  reminders: [
    { time: "08:00", name: "Metformin", dose: "500 mg", taken: true },
    { time: "13:00", name: "Vitamin D", dose: "1000 IU", taken: true },
    { time: "19:30", name: "Lisinopril", dose: "10 mg" },
  ],
  tone: "primary",
  bordered: false,
};

export function Health20({
  heading,
  reminders = [],
  tone = "primary",
  bordered = false,
  className,
}: Health20Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <Bell
            className={cn("size-4 shrink-0", iconClasses[tone])}
            aria-hidden="true"
          />
          {heading && (
            <span className="text-xs font-semibold text-muted-foreground">
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
              <span className="w-10 shrink-0 text-xs tabular-nums text-muted-foreground">
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
