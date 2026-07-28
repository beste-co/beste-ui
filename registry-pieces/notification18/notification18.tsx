"use client";

import { Bell, CalendarCheck, CreditCard, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "emerald" | "amber";

interface Activity {
  icon?: LucideIcon;
  title: string;
  meta: string;
  time: string;
  tone?: Tone;
}

interface Notification18Props {
  title?: string;
  items?: Activity[];
  className?: string;
}

const chipStyles: Record<Tone, string> = {
  primary: "bg-primary/10 text-primary",
  emerald: "bg-emerald-500/10 text-emerald-600",
  amber: "bg-amber-500/10 text-amber-600",
};

export const notification18Demo: Notification18Props = {
  title: "Activity",
  items: [
    {
      icon: CalendarCheck,
      title: "Rowan Blake confirmed",
      meta: "Intake · 09:00",
      time: "2m",
      tone: "emerald",
    },
    {
      icon: CreditCard,
      title: "Invoice #4821 paid",
      meta: "$1,240 · Card",
      time: "18m",
      tone: "primary",
    },
    {
      icon: Bell,
      title: "Renewal due soon",
      meta: "3 members this week",
      time: "1h",
      tone: "amber",
    },
  ],
};

export function Notification18({
  title,
  items = [],
  className,
}: Notification18Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-80 rounded-md border border-border bg-card p-4 shadow-xl">
        {title && (
          <p className="mb-3 px-1 text-sm font-semibold text-card-foreground">
            {title}
          </p>
        )}
        <div className="flex flex-col gap-1">
          {items.map((item, index) => {
            const Icon = item.icon ?? Bell;
            return (
              <div
                key={index}
                className="flex items-center gap-3 rounded-md px-1 py-2"
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-md",
                    chipStyles[item.tone ?? "primary"]
                  )}
                  aria-hidden="true"
                >
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-card-foreground">
                    {item.title}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {item.meta}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {item.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
