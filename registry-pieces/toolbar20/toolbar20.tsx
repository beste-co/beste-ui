"use client";

import {
  CalendarPlus,
  type LucideIcon,
  MessageSquarePlus,
  Plus,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Action {
  icon: LucideIcon;
  label: string;
  primary?: boolean;
}

interface Toolbar20Props {
  items?: Action[];
  className?: string;
}

export const toolbar20Demo: Toolbar20Props = {
  items: [
    { icon: Plus, label: "New member", primary: true },
    { icon: CalendarPlus, label: "Book appointment" },
    { icon: MessageSquarePlus, label: "Message" },
    { icon: Search, label: "Search" },
  ],
};

export function Toolbar20({ items = [], className }: Toolbar20Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1.5 shadow-xl">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <span
              key={index}
              title={item.label}
              className={cn(
                "flex size-10 items-center justify-center rounded-full",
                item.primary
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="size-5" aria-hidden="true" />
            </span>
          );
        })}
      </div>
    </div>
  );
}
