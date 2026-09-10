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

type Surface = "card" | "glass";

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
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
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
  foreground: "bg-foreground text-background hover:bg-current/90",
  violet: "bg-violet-500 text-white hover:bg-violet-600",
  emerald: "bg-emerald-500 text-white hover:bg-emerald-600",
  sky: "bg-sky-500 text-white hover:bg-sky-600",
  amber: "bg-amber-500 text-white hover:bg-amber-600",
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

export const automation10Demo: Automation10Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
      <span className="relative size-7 shrink-0 overflow-hidden rounded-md bg-current/10">
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
      className="size-7 shrink-0 rounded-md bg-current/10"
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
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Automation10Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center gap-1">
          {apps.map((a, i) => (
            <div key={i} className="flex items-center gap-1">
              <AppIcon item={a} />
              {i < apps.length - 1 && (
                <ArrowRight
                  className="size-3 text-current/60"
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
        <span className="text-sm font-semibold">
          {name}
        </span>
        {description && (
          <p className="line-clamp-2 text-xs leading-snug text-current/60">
            {description}
          </p>
        )}
        <div className="flex items-center justify-between border-t border-current/15 pt-2">
          {typeof installs === "number" && (
            <span className="font-mono text-xs tabular-nums text-current/60">
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
