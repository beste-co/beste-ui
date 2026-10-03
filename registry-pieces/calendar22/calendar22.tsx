"use client";

import { cn } from "@/lib/utils";

interface Calendar22Props {
  label?: string;
  upcoming?: { label: string; date: string }[];
  bordered?: boolean;
  className?: string;
}

export const calendar22Demo: Calendar22Props = {
  label: "Coming up",
  upcoming: [
    { label: "Project Horizon launch", date: "May 1" },
    { label: "Team offsite · Bodrum", date: "May 12" },
    { label: "Product review", date: "May 19" },
    { label: "Design + Eng sync", date: "May 23" },
  ],
  bordered: false,
};

export function Calendar22({
  label,
  upcoming = [],
  bordered = false,
  className,
}: Calendar22Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 flex-col gap-1.5 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        {label && (
          <span className="text-xs font-semibold text-muted-foreground">
            {label}
          </span>
        )}
        <div className="flex flex-col">
          {upcoming.map((item, idx) => {
            const [month, day] = item.date.split(" ");
            return (
              <div
                key={idx}
                className="flex items-center gap-3 py-1"
              >
                <div className="flex w-10 shrink-0 items-baseline gap-1">
                  <span className="text-sm font-bold tabular-nums text-card-foreground">
                    {day}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {month}
                  </span>
                </div>
                <span className="flex-1 truncate text-sm text-card-foreground">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
