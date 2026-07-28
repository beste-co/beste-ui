"use client";

import { Bell, Compass, Home, Mail, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppTab {
  label: string;
  icon: "home" | "explore" | "inbox" | "notifications" | "profile";
  active?: boolean;
}

interface Nav25Props {
  tabs?: AppTab[];
  className?: string;
}

const iconMap = {
  home: Home,
  explore: Compass,
  inbox: Mail,
  notifications: Bell,
  profile: User,
};

export const nav25Demo: Nav25Props = {
  tabs: [
    { label: "Home", icon: "home" },
    { label: "Explore", icon: "explore", active: true },
    { label: "Inbox", icon: "inbox" },
    { label: "Alerts", icon: "notifications" },
    { label: "Me", icon: "profile" },
  ],
};

export function Nav25({ tabs = [], className }: Nav25Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center justify-between border-t border-border bg-card px-4 py-2 shadow-lg">
        {tabs.map((t, idx) => {
          const Icon = iconMap[t.icon];
          return (
            <button
              key={idx}
              type="button"
              className={cn(
                "relative flex flex-col items-center gap-0.5 text-xs",
                t.active
                  ? "font-semibold text-primary"
                  : "text-muted-foreground"
              )}
            >
              {t.active && (
                <span
                  className="absolute -top-2 h-0.5 w-8 rounded-full bg-primary"
                  aria-hidden="true"
                />
              )}
              <Icon className="size-5" aria-hidden="true" />
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
