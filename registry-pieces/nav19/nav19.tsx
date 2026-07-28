"use client";

import { Bell, Home, Plus, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomTab {
  label: string;
  icon: "home" | "search" | "plus" | "bell" | "user";
  active?: boolean;
  badge?: number;
}

interface Nav19Props {
  tabs?: BottomTab[];
  className?: string;
}

const iconMap = {
  home: Home,
  search: Search,
  plus: Plus,
  bell: Bell,
  user: User,
};

export const nav19Demo: Nav19Props = {
  tabs: [
    { label: "Home", icon: "home", active: true },
    { label: "Search", icon: "search" },
    { label: "", icon: "plus" },
    { label: "Inbox", icon: "bell", badge: 3 },
    { label: "Profile", icon: "user" },
  ],
};

export function Nav19({ tabs = [], className }: Nav19Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-end justify-between gap-1 rounded-2xl border border-border bg-card/95 p-2 shadow-lg backdrop-blur">
        {tabs.map((t, idx) => {
          const Icon = iconMap[t.icon];
          const isPlus = t.icon === "plus";
          return (
            <button
              key={idx}
              type="button"
              className={cn(
                "relative flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-xs",
                isPlus
                  ? "text-background"
                  : t.active
                    ? "font-semibold text-card-foreground"
                    : "text-muted-foreground"
              )}
            >
              {isPlus ? (
                <span className="flex size-10 items-center justify-center rounded-full bg-foreground text-background shadow-md">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
              ) : (
                <span className="relative">
                  <Icon className="size-5" aria-hidden="true" />
                  {typeof t.badge === "number" && (
                    <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
                      {t.badge}
                    </span>
                  )}
                </span>
              )}
              {!isPlus && t.label && <span>{t.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
