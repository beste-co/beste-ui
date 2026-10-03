"use client";

import { Bell, CalendarCheck, CreditCard, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "emerald" | "amber";

interface Activity {
  icon?: LucideIcon;
  title: string;
  meta: string;
  time?: string;
  tone?: Tone;
}

interface Notification18Props {
  title?: string;
  items?: Activity[];
  bordered?: boolean;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  primary: "text-primary",
  emerald: "text-emerald-600",
  amber: "text-amber-600",
};

export const notification18Demo: Notification18Props = {
  items: [
    {
      icon: CalendarCheck,
      title: "Nils Frahm confirmed",
      meta: "Intake at 09:00",
      tone: "emerald",
    },
    {
      icon: CreditCard,
      title: "Invoice paid",
      meta: "$1,240 by card",
      tone: "primary",
    },
    {
      icon: Bell,
      title: "Renewal due soon",
      meta: "3 members this week",
      tone: "amber",
    },
  ],
  bordered: false,
};

export function Notification18({
  title,
  items = [],
  bordered = false,
  className,
}: Notification18Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("w-full max-w-80 rounded-md bg-card p-4 shadow-xl", bordered && "border border-border")}>
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
                <Icon
                  className={cn(
                    "size-5 shrink-0",
                    iconClasses[item.tone ?? "primary"]
                  )}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-card-foreground">
                    {item.title}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {item.meta}
                  </p>
                </div>
                {item.time && (
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {item.time}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
