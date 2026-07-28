"use client";
import type { LucideIcon } from "lucide-react";
import {
  CreditCard,
  FileText,
  Hash,
  Mail,
  MessageSquare,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

type StepPreset =
  | "trigger"
  | "email"
  | "slack"
  | "stripe"
  | "notion"
  | "discord";

interface Automation7Step {
  preset?: StepPreset;
  image?: string;
  alt?: string;
  label: string;
  detail: string;
}

interface Automation7Props {
  steps?: Automation7Step[];
  headerLabel?: string;
  className?: string;
}

const PRESETS: Record<StepPreset, { icon: LucideIcon; tile: string }> = {
  trigger: { icon: Zap, tile: "bg-amber-500 text-white" },
  email: { icon: Mail, tile: "bg-rose-500 text-white" },
  slack: { icon: Hash, tile: "bg-violet-500 text-white" },
  stripe: { icon: CreditCard, tile: "bg-indigo-500 text-white" },
  notion: {
    icon: FileText,
    tile: "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900",
  },
  discord: { icon: MessageSquare, tile: "bg-indigo-600 text-white" },
};

export const automation7Demo: Automation7Props = {
  headerLabel: "Workflow",
  steps: [
    {
      image: "https://oud.pics/sm/l/stripe.jpeg",
      alt: "Stripe",
      label: "New payment received",
      detail: "Stripe · over $100",
    },
    {
      image: "https://oud.pics/sm/l/gmail.jpeg",
      alt: "Gmail",
      label: "Send welcome email",
      detail: "Gmail · template:onboarding",
    },
    {
      image: "https://oud.pics/sm/l/notion.png",
      alt: "Notion",
      label: "Create CRM page",
      detail: "Notion · DB:Leads",
    },
    {
      image: "https://oud.pics/sm/l/slack.svg",
      alt: "Slack",
      label: "Notify #revenue",
      detail: "Slack · with link",
    },
  ],
};

function StepTile({ step }: { step: Automation7Step }) {
  if (step.image) {
    return (
      <span className="relative size-7 shrink-0 overflow-hidden rounded-md bg-muted">
        <img
          src={step.image}
          alt={step.alt ?? ""}
          className="absolute inset-0 size-full object-cover"
        />
      </span>
    );
  }
  if (step.preset) {
    const cfg = PRESETS[step.preset];
    const Icon = cfg.icon;
    return (
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-md",
          cfg.tile
        )}
        aria-hidden="true"
      >
        <Icon className="size-3.5" />
      </span>
    );
  }
  return <span className="size-7 shrink-0 rounded-md bg-muted" aria-hidden="true" />;
}

export function Automation7({
  steps = [],
  headerLabel = "Workflow",
  className,
}: Automation7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1 rounded-md border border-border bg-card p-3 shadow-sm">
        <span className="pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {headerLabel}
        </span>
        <ol className="flex flex-col">
          {steps.map((s, i) => {
            const isLast = i === steps.length - 1;
            return (
              <li key={i} className="flex gap-2">
                <div className="flex flex-col items-center">
                  <StepTile step={s} />
                  {!isLast && (
                    <span
                      className="my-1 w-px flex-1 bg-border"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col pb-3 pt-0.5">
                  <span className="text-xs font-medium text-card-foreground">
                    {s.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {s.detail}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
