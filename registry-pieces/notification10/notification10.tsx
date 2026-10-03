"use client";

import { Bell, Heart, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StackItem {
  icon: "bell" | "heart" | "message";
  title: string;
  description: string;
}

interface Notification10Props {
  items?: StackItem[];
  bordered?: boolean;
  className?: string;
}

const iconMap = {
  bell: Bell,
  heart: Heart,
  message: MessageCircle,
};

const iconColor: Record<StackItem["icon"], string> = {
  bell: "text-amber-600 dark:text-amber-400",
  heart: "text-rose-600 dark:text-rose-400",
  message: "text-sky-600 dark:text-sky-400",
};

export const notification10Demo: Notification10Props = {
  items: [
    {
      icon: "heart",
      title: "3 new likes",
      description: "on your post about shipping velocity",
    },
    {
      icon: "message",
      title: "Alex replied",
      description: "in the #launch-prep thread",
    },
    {
      icon: "bell",
      title: "Daily standup",
      description: "starts in 10 minutes",
    },
  ],
  bordered: false,
};

export function Notification10({
  items = [],
  bordered = false,
  className,
}: Notification10Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="relative w-full max-w-72">
        <div
          className="absolute inset-x-4 -top-2 h-4 rounded-t-lg border border-b-0 border-border bg-card/60 shadow-sm"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-2 -top-1 h-3 rounded-t-lg border border-b-0 border-border bg-card/80 shadow-sm"
          aria-hidden="true"
        />
        <div className={cn("relative flex flex-col gap-2 rounded-lg bg-card p-3 shadow-xl", bordered && "border border-border")}>
          {items.map((item, idx) => {
            const Icon = iconMap[item.icon];
            return (
              <div key={idx} className="flex items-start gap-2.5">
                <Icon
                  className={cn("mt-0.5 size-4 shrink-0", iconColor[item.icon])}
                  aria-hidden="true"
                />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-xs font-semibold text-card-foreground">
                    {item.title}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {item.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
