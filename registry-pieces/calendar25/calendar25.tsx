"use client";

import { cn } from "@/lib/utils";

interface Calendar25Props {
  heading?: string;
  quickItems?: { label: string; time: string }[];
  bordered?: boolean;
  className?: string;
}

export const calendar25Demo: Calendar25Props = {
  heading: "Quick create",
  quickItems: [
    { label: "15-min check-in", time: "Today 15:00" },
    { label: "30-min 1:1", time: "Today 16:30" },
    { label: "Focus block", time: "Tomorrow 09:00" },
    { label: "All-day review", time: "Friday" },
  ],
  bordered: false,
};

export function Calendar25({
  heading,
  quickItems = [],
  bordered = false,
  className,
}: Calendar25Props) {
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
        <div className="grid grid-cols-2 gap-1.5">
          {quickItems.map((item, idx) => (
            <button
              key={idx}
              type="button"
              className={cn("flex flex-col gap-0.5 rounded-md p-2 text-left text-xs hover:bg-muted", bordered ? "border border-border bg-card" : "bg-muted hover:bg-muted-foreground/15")}
            >
              <span className="font-semibold text-card-foreground">
                {item.label}
              </span>
              <span className="text-muted-foreground">{item.time}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
