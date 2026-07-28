"use client";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CreditCard,
  FileText,
  Hash,
  Mail,
  MessageSquare,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber";

type AppPreset = "slack" | "gmail" | "stripe" | "notion" | "discord";

interface AppItem {
  preset?: AppPreset;
  image?: string;
  alt?: string;
}

interface Automation10Props {
  apps?: AppItem[];
  name?: string;
  description?: string;
  installs?: number;
  installsLabel?: string;
  ctaLabel?: string;
  tone?: Tone;
  className?: string;
}

const PRESETS: Record<AppPreset, { icon: LucideIcon; tile: string }> = {
  slack: { icon: Hash, tile: "bg-violet-500 text-white" },
  gmail: { icon: Mail, tile: "bg-rose-500 text-white" },
  stripe: { icon: CreditCard, tile: "bg-indigo-500 text-white" },
  notion: {
    icon: FileText,
    tile: "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900",
  },
  discord: { icon: MessageSquare, tile: "bg-indigo-600 text-white" },
};

const ctaClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  foreground: "bg-foreground text-background hover:bg-foreground/90",
  violet: "bg-violet-500 text-white hover:bg-violet-600",
  emerald: "bg-emerald-500 text-white hover:bg-emerald-600",
  sky: "bg-sky-500 text-white hover:bg-sky-600",
  amber: "bg-amber-500 text-white hover:bg-amber-600",
};

export const automation10Demo: Automation10Props = {
  apps: [
    { image: "https://oud.pics/sm/l/stripe.jpeg", alt: "Stripe" },
    { image: "https://oud.pics/sm/l/notion.png", alt: "Notion" },
    { image: "https://oud.pics/sm/l/slack.svg", alt: "Slack" },
  ],
  name: "Sync paid invoices to Notion and ping Slack",
  description:
    "Triggers on Stripe payment, logs the invoice in Notion, and posts a thread to #revenue.",
  installs: 4280,
  installsLabel: "installs",
  ctaLabel: "Use recipe",
  tone: "primary",
};

function AppIcon({ item }: { item: AppItem }) {
  if (item.image) {
    return (
      <span className="relative size-7 shrink-0 overflow-hidden rounded-md bg-muted">
        <img
          src={item.image}
          alt={item.alt ?? ""}
          className="absolute inset-0 size-full object-cover"
        />
      </span>
    );
  }
  if (item.preset) {
    const cfg = PRESETS[item.preset];
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
  return (
    <span
      className="size-7 shrink-0 rounded-md bg-muted"
      aria-hidden="true"
    />
  );
}

export function Automation10({
  apps = [],
  name = "Recipe",
  description,
  installs,
  installsLabel = "installs",
  ctaLabel = "Use recipe",
  tone = "primary",
  className,
}: Automation10Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-1">
          {apps.map((a, i) => (
            <div key={i} className="flex items-center gap-1">
              <AppIcon item={a} />
              {i < apps.length - 1 && (
                <ArrowRight
                  className="size-3 text-muted-foreground"
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
        <span className="text-sm font-semibold text-card-foreground">
          {name}
        </span>
        {description && (
          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
            {description}
          </p>
        )}
        <div className="flex items-center justify-between border-t border-border pt-2">
          {typeof installs === "number" && (
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              {installs.toLocaleString()} {installsLabel}
            </span>
          )}
          <button
            type="button"
            className={cn(
              "ml-auto inline-flex items-center gap-1 rounded-sm px-2.5 py-1 text-xs font-semibold transition-colors",
              ctaClasses[tone]
            )}
          >
            <Plus className="size-3" aria-hidden="true" />
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
