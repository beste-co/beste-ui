"use client";

import { Bell, Home, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

type TabId = "home" | "search" | "alerts" | "profile";

interface Nav32Props {
  active?: TabId;
  alerts?: number;
  className?: string;
}

const tabs: { id: TabId; Icon: typeof Home; label: string }[] = [
  { id: "home", Icon: Home, label: "Home" },
  { id: "search", Icon: Search, label: "Search" },
  { id: "alerts", Icon: Bell, label: "Alerts" },
  { id: "profile", Icon: User, label: "Profile" },
];

export const nav32Demo: Nav32Props = {
  active: "alerts",
  alerts: 3,
};

export function Nav32({
  active = "home",
  alerts,
  className,
}: Nav32Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-sm">
        {tabs.map(({ id, Icon, label }) => {
          const isActive = active === id;
          const showBadge = id === "alerts" && typeof alerts === "number" && alerts > 0;
          return (
            <button
              key={id}
              type="button"
              aria-label={label}
              aria-pressed={isActive}
              className={cn(
                "relative flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors",
                isActive
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-card-foreground"
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {isActive && (
                <span className="text-xs font-semibold">{label}</span>
              )}
              {showBadge && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 min-w-4 items-center justify-center rounded-full bg-rose-500 font-mono text-xs font-bold text-white">
                  {alerts! > 9 ? "9+" : alerts}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
