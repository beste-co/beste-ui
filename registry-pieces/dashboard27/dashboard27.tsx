"use client";

import type { LucideIcon } from "lucide-react";
import { AtSign, Bell, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Channel = "email" | "slack" | "push";

interface Dashboard27Props {
  heading?: string;
  totalSuffix?: string;
  emailLabel?: string;
  slackLabel?: string;
  pushLabel?: string;
  emptySymbol?: string;
  counts?: Record<Channel, number>;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
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

export const dashboard27Demo: Dashboard27Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Dashboard27Props) {
  const order: Channel[] = ["email", "slack", "push"];
  const labels: Record<Channel, string> = {
    email: emailLabel,
    slack: slackLabel,
    push: pushLabel,
  };
  const total = order.reduce((s, k) => s + (counts[k] ?? 0), 0);

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
            {heading}
          </span>
          <span className="font-mono text-xs text-current/60">
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
                <span className="flex-1 text-xs">
                  {labels[k]}
                </span>
                {n > 0 ? (
                  <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-white">
                    {n}
                  </span>
                ) : (
                  <span className="text-xs text-current/60">{emptySymbol}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
