"use client";

import { Bell, Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotifItem {
  icon: "star" | "bell" | "check";
  label: string;
  time?: string;
  unread?: boolean;
}

interface Nav29Props {
  items?: NotifItem[];
  bordered?: boolean;
  className?: string;
}

const iconMap = {
  star: Star,
  bell: Bell,
  check: Check,
};

const iconColor: Record<NotifItem["icon"], string> = {
  star: "text-amber-500",
  bell: "text-sky-500",
  check: "text-emerald-500",
};

export const nav29Demo: Nav29Props = {
  items: [
    {
      icon: "star",
      label: "Hania Rani starred Project Horizon",
      unread: true,
    },
    {
      icon: "bell",
      label: "Build passed on main",
    },
    {
      icon: "check",
      label: "Pull request merged",
    },
  ],
  bordered: false,
};

export function Nav29({ items = [], bordered = false, className }: Nav29Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-72 flex-col gap-0.5 rounded-lg bg-card p-1 shadow-lg", bordered && "border border-border")}>
        {items.map((item, idx) => {
          const Icon = iconMap[item.icon];
          return (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-md px-2 py-1.5"
            >
              <Icon
                className={cn("size-4 shrink-0", iconColor[item.icon])}
                aria-hidden="true"
              />
              <span className="flex-1 truncate text-xs text-card-foreground">
                {item.label}
              </span>
              {item.time && (
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {item.time}
                </span>
              )}
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
  );
}
