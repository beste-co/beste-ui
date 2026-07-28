"use client";

import { DollarSign, ShoppingCart, Users, Zap } from "lucide-react";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber";

interface Dashboard3Widget {
  label: string;
  value: string;
  icon?: "revenue" | "orders" | "users" | "signals";
}

interface Dashboard3Props {
  widgets?: Dashboard3Widget[];
  tone?: Tone;
  className?: string;
}

const ICONS: Record<NonNullable<Dashboard3Widget["icon"]>, LucideIcon> = {
  revenue: DollarSign,
  orders: ShoppingCart,
  users: Users,
  signals: Zap,
};

const tileClasses: Record<Tone, string> = {
  primary: "bg-primary/15 text-primary",
  foreground: "bg-foreground/10 text-foreground",
  violet: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  emerald: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  sky: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  amber: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
};

export const dashboard3Demo: Dashboard3Props = {
  widgets: [
    { label: "Revenue", value: "$48.2K", icon: "revenue" },
    { label: "Orders", value: "1,284", icon: "orders" },
    { label: "Users", value: "9.4K", icon: "users" },
    { label: "Events", value: "62.1K", icon: "signals" },
  ],
  tone: "primary",
};

export function Dashboard3({
  widgets = [],
  tone = "primary",
  className,
}: Dashboard3Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="grid w-full max-w-80 grid-cols-2 gap-2">
        {widgets.map((w, i) => {
          const Icon = w.icon ? ICONS[w.icon] : Zap;
          return (
            <div
              key={i}
              className="flex items-center gap-2 rounded-md border border-border bg-card p-2.5 shadow-sm"
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-md",
                  tileClasses[tone]
                )}
                aria-hidden="true"
              >
                <Icon className="size-3.5" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-xs text-muted-foreground">
                  {w.label}
                </span>
                <span className="truncate font-mono text-sm font-semibold tabular-nums text-card-foreground">
                  {w.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
