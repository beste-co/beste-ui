"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber";

interface Dashboard8Day {
  label: string;
  value: number;
  today?: boolean;
}

interface Dashboard8Props {
  title?: string;
  total?: string;
  days?: Dashboard8Day[];
  tone?: Tone;
  className?: string;
}

const barClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  amber: "bg-amber-500",
};

const mutedBarClasses: Record<Tone, string> = {
  primary: "bg-primary/30",
  foreground: "bg-foreground/25",
  violet: "bg-violet-500/30",
  emerald: "bg-emerald-500/30",
  sky: "bg-sky-500/30",
  amber: "bg-amber-500/30",
};

export const dashboard8Demo: Dashboard8Props = {
  title: "Events this week",
  total: "2,840",
  days: [
    { label: "Mon", value: 280 },
    { label: "Tue", value: 410 },
    { label: "Wed", value: 520 },
    { label: "Thu", value: 340 },
    { label: "Fri", value: 680 },
    { label: "Sat", value: 480 },
    { label: "Sun", value: 130, today: true },
  ],
  tone: "violet",
};

export function Dashboard8({
  title = "This week",
  total,
  days = [],
  tone = "violet",
  className,
}: Dashboard8Props) {
  const max = Math.max(...days.map((d) => d.value), 1);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </span>
          {total && (
            <span className="font-mono text-sm font-semibold tabular-nums text-card-foreground">
              {total}
            </span>
          )}
        </div>
        <div className="flex h-14 items-end gap-1.5">
          {days.map((d) => {
            const h = (d.value / max) * 100;
            return (
              <div
                key={d.label}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <div className="flex h-10 w-full items-end">
                  <span
                    className={cn(
                      "w-full rounded-sm",
                      d.today ? barClasses[tone] : mutedBarClasses[tone]
                    )}
                    style={{ height: `${Math.max(6, h)}%` }}
                    aria-hidden="true"
                  />
                </div>
                <span
                  className={cn(
                    "text-xs",
                    d.today
                      ? "font-semibold text-card-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {d.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
