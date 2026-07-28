"use client";

import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Calendar25Props {
  heading?: string;
  quickItems?: { label: string; time: string }[];
  className?: string;
}

export const calendar25Demo: Calendar25Props = {
  heading: "Quick create",
  quickItems: [
    { label: "15-min check-in", time: "Today · 15:00" },
    { label: "30-min 1:1", time: "Today · 16:30" },
    { label: "Focus block", time: "Tomorrow · 09:00" },
    { label: "All-day review", time: "Fri · All day" },
  ],
};

export function Calendar25({
  heading,
  quickItems = [],
  className,
}: Calendar25Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-amber-500/15 text-amber-500">
            <Zap className="size-3.5" aria-hidden="true" />
          </div>
          {heading && (
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {heading}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {quickItems.map((item, idx) => (
            <button
              key={idx}
              type="button"
              className="flex flex-col gap-0.5 rounded-md border border-border bg-card p-2 text-left text-xs hover:bg-muted"
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
