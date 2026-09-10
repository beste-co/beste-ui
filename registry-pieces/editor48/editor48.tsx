"use client";

import { CircleCheck, ExternalLink, Settings } from "lucide-react";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "emerald"
  | "sky"
  | "violet"
  | "amber"
  | "rose";

interface Editor48Props {
  headerLabel?: string;
  changeLabel?: string;
  url?: string;
  verifiedLabel?: string;
  changesTitle?: string;
  changesDescription?: string;
  logLabel?: string;
  publishLabel?: string;
  tone?: Tone;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const buttonClasses: Record<Tone, string> = {
  neutral: "bg-current/10 text-foreground hover:bg-current/10",
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  foreground: "bg-foreground text-background hover:bg-current/90",
  emerald: "bg-emerald-600 text-white hover:bg-emerald-700",
  sky: "bg-sky-600 text-white hover:bg-sky-700",
  violet: "bg-violet-600 text-white hover:bg-violet-700",
  amber: "bg-amber-600 text-white hover:bg-amber-700",
  rose: "bg-rose-600 text-white hover:bg-rose-700",
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

export const editor48Demo: Editor48Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  headerLabel: "Website URLs",
  changeLabel: "Change",
  url: "https://beste.co",
  verifiedLabel: "Domain verified",
  changesTitle: "Unpublished Changes",
  changesDescription: "You have changes that are not yet published",
  logLabel: "View log",
  publishLabel: "Publish Changes",
  tone: "foreground",
};

export function Editor48({
  headerLabel,
  changeLabel,
  url,
  verifiedLabel,
  changesTitle,
  changesDescription,
  logLabel,
  publishLabel,
  tone = "foreground",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Editor48Props) {
  const hasUrlSection = Boolean(
    headerLabel || changeLabel || url || verifiedLabel
  );
  const hasTextBlock = Boolean(changesTitle || changesDescription);
  const hasChangesSection = hasTextBlock || Boolean(logLabel);

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full max-w-xs flex-col gap-4 rounded-xl p-4 shadow-sm",
          surfaceTone,
          bordered && "border border-current/15"
        )}
      >
        {hasUrlSection && (
          <div className="flex flex-col gap-2">
            {(headerLabel || changeLabel) && (
              <div className="flex items-center justify-between gap-2">
                {headerLabel && (
                  <span className="text-sm font-medium">
                    {headerLabel}
                  </span>
                )}
                {changeLabel && (
                  <button
                    type="button"
                    className="flex items-center gap-1 text-xs text-current/60 hover:text-current"
                  >
                    <Settings className="size-3.5" aria-hidden="true" />
                    {changeLabel}
                  </button>
                )}
              </div>
            )}
            {url && (
              <div className="flex items-center gap-2">
                <ExternalLink
                  className="size-3.5 shrink-0 text-current/60"
                  aria-hidden="true"
                />
                <span className="truncate text-xs">
                  {url}
                </span>
              </div>
            )}
            {verifiedLabel && (
              <div className="flex items-center gap-2">
                <CircleCheck
                  className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-500"
                  aria-hidden="true"
                />
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  {verifiedLabel}
                </span>
              </div>
            )}
          </div>
        )}

        {hasChangesSection && (
          <div className="flex flex-col gap-2">
            {hasTextBlock && (
              <div className="flex flex-col gap-0.5">
                {changesTitle && (
                  <span className="text-sm font-medium">
                    {changesTitle}
                  </span>
                )}
                {changesDescription && (
                  <p className="text-xs text-current/60">
                    {changesDescription}
                  </p>
                )}
              </div>
            )}
            {logLabel && (
              <button
                type="button"
                className="self-start text-xs font-medium hover:underline"
              >
                {logLabel}
              </button>
            )}
          </div>
        )}

        {publishLabel && (
          <button
            type="button"
            className={cn(
              "w-full rounded-lg px-4 py-2.5 text-xs font-semibold transition-colors",
              buttonClasses[tone]
            )}
          >
            {publishLabel}
          </button>
        )}
      </div>
    </div>
  );
}
