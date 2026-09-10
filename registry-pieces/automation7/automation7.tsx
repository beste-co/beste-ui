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

type Surface = "card" | "glass";

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
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
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

export const automation7Demo: Automation7Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
      <span className="relative size-7 shrink-0 overflow-hidden rounded-md bg-current/10">
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
  return <span className="size-7 shrink-0 rounded-md bg-current/10" aria-hidden="true" />;
}

export function Automation7({
  steps = [],
  headerLabel = "Workflow",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Automation7Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-1 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <span className="pb-1 text-xs font-semibold uppercase tracking-wide text-current/60">
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
                  <span className="text-xs font-medium">
                    {s.label}
                  </span>
                  <span className="text-xs text-current/60">
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
