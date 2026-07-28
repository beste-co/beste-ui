"use client";

import { Bell, Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotifItem {
  icon: "star" | "bell" | "check";
  label: string;
  time: string;
  unread?: boolean;
}

interface Nav29Props {
  items?: NotifItem[];
  className?: string;
}

const iconMap = {
  star: Star,
  bell: Bell,
  check: Check,
};

const iconColor: Record<NotifItem["icon"], string> = {
  star: "bg-amber-500/15 text-amber-500",
  bell: "bg-sky-500/15 text-sky-500",
  check: "bg-emerald-500/15 text-emerald-500",
};

export const nav29Demo: Nav29Props = {
  items: [
    {
      icon: "star",
      label: "Mira starred Project Horizon",
      time: "2m",
      unread: true,
    },
    {
      icon: "bell",
      label: "Build passed · main",
      time: "18m",
    },
    {
      icon: "check",
      label: "PR #482 merged",
      time: "1h",
    },
  ],
};

export function Nav29({ items = [], className }: Nav29Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-72 flex-col gap-0.5 rounded-lg border border-border bg-card p-1 shadow-lg">
        <div className="flex items-center justify-between px-2 pb-1 pt-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Notifications
          </span>
          <button
            type="button"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Mark read
          </button>
        </div>
        <div className="flex flex-col">
          {items.map((item, idx) => {
            const Icon = iconMap[item.icon];
            return (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-md px-2 py-1.5"
              >
                <div
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full",
                    iconColor[item.icon]
                  )}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                </div>
                <span className="flex-1 truncate text-xs text-card-foreground">
                  {item.label}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {item.time}
                </span>
                {item.unread && (
                  <span
                    className="size-1.5 shrink-0 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
