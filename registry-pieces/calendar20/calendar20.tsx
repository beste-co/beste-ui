"use client";

import { cn } from "@/lib/utils";

interface Reminder {
  title: string;
  when: string;
  tone: "sky" | "emerald" | "rose" | "amber";
}

interface Calendar20Props {
  heading?: string;
  reminders?: Reminder[];
  bordered?: boolean;
  className?: string;
}

const dotClasses: Record<Reminder["tone"], string> = {
  sky: "bg-sky-500",
  emerald: "bg-emerald-500",
  rose: "bg-rose-500",
  amber: "bg-amber-500",
};

export const calendar20Demo: Calendar20Props = {
  heading: "Upcoming reminders",
  reminders: [
    {
      title: "Pay estimated tax",
      when: "Thu 17:00",
      tone: "rose",
    },
    {
      title: "Annual review prep",
      when: "Fri 09:00",
      tone: "sky",
    },
    {
      title: "Call parents",
      when: "Sat 11:00",
      tone: "emerald",
    },
  ],
  bordered: false,
};

export function Calendar20({
  heading,
  reminders = [],
  bordered = false,
  className,
}: Calendar20Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        {heading && (
          <span className="text-xs font-semibold text-muted-foreground">
            {heading}
          </span>
        )}
        <div className="flex flex-col divide-y divide-border">
          {reminders.map((r, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 py-1.5"
            >
              <span
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  dotClasses[r.tone]
                )}
                aria-hidden="true"
              />
              <span className="flex-1 truncate text-sm font-medium text-card-foreground">
                {r.title}
              </span>
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {r.when}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
