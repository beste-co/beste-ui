"use client";

import { DollarSign, ShoppingCart, Users, Zap } from "lucide-react";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

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
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const ICONS: Record<NonNullable<Dashboard3Widget["icon"]>, LucideIcon> = {
  revenue: DollarSign,
  orders: ShoppingCart,
  users: Users,
  signals: Zap,
};

const iconClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  violet: "text-violet-600 dark:text-violet-400",
  emerald: "text-emerald-600 dark:text-emerald-400",
  sky: "text-sky-600 dark:text-sky-400",
  amber: "text-amber-600 dark:text-amber-400",
};


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const dashboard3Demo: Dashboard3Props = {
  surface: "card",
  bordered: false,
  inverted: false,
  widgets: [
    { label: "Revenue", value: "$48.2K" },
    { label: "Orders", value: "1,284" },
    { label: "Users", value: "9.4K" },
    { label: "Events", value: "62.1K" },
  ],
  tone: "primary",
};

export function Dashboard3({
  widgets = [],
  tone = "primary",
  surface = "card",
  bordered = false,
  inverted = false,
  className,
}: Dashboard3Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="grid w-full max-w-80 grid-cols-2 gap-2">
        {widgets.map((w, i) => {
          const Icon = w.icon ? ICONS[w.icon] : null;
          return (
            <div
              key={i}
              className={cn("flex items-center gap-2 rounded-md p-2.5 shadow-sm", surfaceTone, bordered && "border border-current/15")}
            >
              {Icon && (
                <Icon
                  className={cn("size-4 shrink-0", iconClasses[tone])}
                  aria-hidden="true"
                />
              )}
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-xs text-current/60">
                  {w.label}
                </span>
                <span className="truncate text-sm font-semibold tabular-nums">
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
