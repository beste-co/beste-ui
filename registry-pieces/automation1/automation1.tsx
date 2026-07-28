"use client";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDown,
  Calendar,
  CreditCard,
  FileText,
  GitBranch,
  Hash,
  Mail,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AppPreset =
  | "slack"
  | "gmail"
  | "stripe"
  | "calendar"
  | "github"
  | "notion"
  | "discord";

interface Automation1Step {
  preset?: AppPreset;
  src?: string;
  alt?: string;
  event: string;
}

interface Automation1Props {
  trigger?: Automation1Step;
  action?: Automation1Step;
  triggerLabel?: string;
  actionLabel?: string;
  className?: string;
}

const APPS: Record<
  AppPreset,
  { label: string; icon: LucideIcon; tile: string }
> = {
  slack: { label: "Slack", icon: Hash, tile: "bg-violet-500 text-white" },
  gmail: { label: "Gmail", icon: Mail, tile: "bg-rose-500 text-white" },
  stripe: {
    label: "Stripe",
    icon: CreditCard,
    tile: "bg-indigo-500 text-white",
  },
  calendar: {
    label: "Calendar",
    icon: Calendar,
    tile: "bg-sky-500 text-white",
  },
  github: {
    label: "GitHub",
    icon: GitBranch,
    tile: "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900",
  },
  notion: {
    label: "Notion",
    icon: FileText,
    tile: "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900",
  },
  discord: {
    label: "Discord",
    icon: MessageSquare,
    tile: "bg-indigo-600 text-white",
  },
};

export const automation1Demo: Automation1Props = {
  triggerLabel: "When",
  actionLabel: "Then",
  trigger: {
    src: "https://oud.pics/sm/l/stripe.jpeg",
    alt: "Stripe",
    event: "Payment received",
  },
  action: {
    src: "https://oud.pics/sm/l/slack.svg",
    alt: "Slack",
    event: "Send #revenue alert",
  },
};

function Tile({ step }: { step: Automation1Step }) {
  if (step.src) {
    return (
      <span className="relative size-9 shrink-0 overflow-hidden rounded-md bg-muted">
        <img
          src={step.src}
          alt={step.alt ?? ""}
          className="absolute inset-0 size-full object-cover"
        />
      </span>
    );
  }
  if (step.preset) {
    const cfg = APPS[step.preset];
    const Icon = cfg.icon;
    return (
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-md",
          cfg.tile
        )}
        aria-hidden="true"
      >
        <Icon className="size-4" />
      </span>
    );
  }
  return <span className="size-9 shrink-0 rounded-md bg-muted" aria-hidden="true" />;
}

function labelFor(step: Automation1Step) {
  if (step.alt) return step.alt;
  if (step.preset) return APPS[step.preset].label;
  return "App";
}

function Row({ kind, step }: { kind: string; step: Automation1Step }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border p-2">
      <Tile step={step} />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {kind}
          </span>
          <span className="truncate text-xs font-semibold text-card-foreground">
            {labelFor(step)}
          </span>
        </div>
        <span className="truncate text-xs text-muted-foreground">
          {step.event}
        </span>
      </div>
    </div>
  );
}

export function Automation1({
  trigger = { preset: "slack", event: "Trigger event" },
  action = { preset: "gmail", event: "Action event" },
  triggerLabel = "When",
  actionLabel = "Then",
  className,
}: Automation1Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1 rounded-md border border-border bg-card p-3 shadow-sm">
        <Row kind={triggerLabel} step={trigger} />
        <div className="flex items-center justify-center py-0.5">
          <span
            className="flex size-5 items-center justify-center rounded-full border border-border bg-muted"
            aria-hidden="true"
          >
            <ArrowDown className="size-3 text-muted-foreground" />
          </span>
        </div>
        <Row kind={actionLabel} step={action} />
      </div>
    </div>
  );
}
