"use client";

import type { LucideIcon } from "lucide-react";
import { AtSign, Bell, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

type Channel = "email" | "slack" | "push";

interface Dashboard27Props {
  heading?: string;
  totalSuffix?: string;
  emailLabel?: string;
  slackLabel?: string;
  pushLabel?: string;
  emptySymbol?: string;
  counts?: Record<Channel, number>;
  className?: string;
}

const CHANNELS: Record<
  Channel,
  { icon: LucideIcon; tile: string }
> = {
  email: {
    icon: AtSign,
    tile: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  },
  slack: {
    icon: MessageSquare,
    tile: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  },
  push: {
    icon: Bell,
    tile: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  },
};

export const dashboard27Demo: Dashboard27Props = {
  heading: "Unread",
  totalSuffix: "total",
  emailLabel: "Email",
  slackLabel: "Slack",
  pushLabel: "Push",
  emptySymbol: "—",
  counts: { email: 14, slack: 32, push: 4 },
};

export function Dashboard27({
  heading = "Unread",
  totalSuffix = "total",
  emailLabel = "Email",
  slackLabel = "Slack",
  pushLabel = "Push",
  emptySymbol = "—",
  counts = { email: 0, slack: 0, push: 0 },
  className,
}: Dashboard27Props) {
  const order: Channel[] = ["email", "slack", "push"];
  const labels: Record<Channel, string> = {
    email: emailLabel,
    slack: slackLabel,
    push: pushLabel,
  };
  const total = order.reduce((s, k) => s + (counts[k] ?? 0), 0);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {heading}
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {total} {totalSuffix}
          </span>
        </div>
        <ul className="flex flex-col gap-1.5">
          {order.map((k) => {
            const c = CHANNELS[k];
            const Icon = c.icon;
            const n = counts[k] ?? 0;
            return (
              <li key={k} className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-md",
                    c.tile
                  )}
                  aria-hidden="true"
                >
                  <Icon className="size-3.5" />
                </span>
                <span className="flex-1 text-xs text-card-foreground">
                  {labels[k]}
                </span>
                {n > 0 ? (
                  <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-white">
                    {n}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">{emptySymbol}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
