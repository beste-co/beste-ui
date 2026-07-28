"use client";

import type { LucideIcon } from "lucide-react";
import { CircleMinus, CirclePlus, Pencil, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

type EventType = "create" | "update" | "delete" | "signup";

interface Dashboard4Event {
  type: EventType;
  actor: string;
  action: string;
  time: string;
}

interface Dashboard4Props {
  events?: Dashboard4Event[];
  headerLabel?: string;
  className?: string;
}

const EVENTS: Record<EventType, { icon: LucideIcon; classes: string }> = {
  create: {
    icon: CirclePlus,
    classes: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  },
  update: {
    icon: Pencil,
    classes: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  },
  delete: {
    icon: CircleMinus,
    classes: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  },
  signup: {
    icon: UserPlus,
    classes: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  },
};

export const dashboard4Demo: Dashboard4Props = {
  headerLabel: "Activity",
  events: [
    { type: "signup", actor: "Ada Lovelace", action: "joined", time: "2m" },
    {
      type: "create",
      actor: "Marcus R.",
      action: "created Project Orion",
      time: "14m",
    },
    {
      type: "update",
      actor: "Priya S.",
      action: "edited Onboarding doc",
      time: "1h",
    },
    { type: "delete", actor: "Tomás L.", action: "archived Q1 specs", time: "3h" },
  ],
};

export function Dashboard4({
  events = [],
  headerLabel = "Activity",
  className,
}: Dashboard4Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {headerLabel}
        </span>
        <div className="flex flex-col gap-2">
          {events.map((e, i) => {
            const cfg = EVENTS[e.type];
            const Icon = cfg.icon;
            return (
              <div key={i} className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full",
                    cfg.classes
                  )}
                  aria-hidden="true"
                >
                  <Icon className="size-3" />
                </span>
                <div className="flex min-w-0 flex-1 items-baseline gap-1 text-xs">
                  <span className="truncate font-medium text-card-foreground">
                    {e.actor}
                  </span>
                  <span className="truncate text-muted-foreground">
                    {e.action}
                  </span>
                </div>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  {e.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
