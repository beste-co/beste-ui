"use client";

import { Bell, CreditCard, Settings, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerticalTab {
  label: string;
  icon: "bell" | "card" | "shield" | "settings";
}

interface Nav7Props {
  tabs?: VerticalTab[];
  activeIndex?: number;
  className?: string;
}

const iconMap = {
  bell: Bell,
  card: CreditCard,
  shield: Shield,
  settings: Settings,
};

export const nav7Demo: Nav7Props = {
  tabs: [
    { label: "Notifications", icon: "bell" },
    { label: "Billing", icon: "card" },
    { label: "Security", icon: "shield" },
    { label: "Preferences", icon: "settings" },
  ],
  activeIndex: 1,
};

export function Nav7({
  tabs = [],
  activeIndex = 0,
  className,
}: Nav7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-48 flex-col gap-0.5">
        {tabs.map((tab, idx) => {
          const Icon = iconMap[tab.icon];
          return (
            <button
              key={idx}
              type="button"
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                idx === activeIndex
                  ? "bg-muted font-semibold text-card-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-card-foreground"
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
