"use client";

import { CircleCheck, ExternalLink, Settings } from "lucide-react";

import { cn } from "@/lib/utils";

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
  className?: string;
}

const buttonClasses: Record<Tone, string> = {
  neutral: "bg-muted text-foreground hover:bg-muted/80",
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  foreground: "bg-foreground text-background hover:bg-foreground/90",
  emerald: "bg-emerald-600 text-white hover:bg-emerald-700",
  sky: "bg-sky-600 text-white hover:bg-sky-700",
  violet: "bg-violet-600 text-white hover:bg-violet-700",
  amber: "bg-amber-600 text-white hover:bg-amber-700",
  rose: "bg-rose-600 text-white hover:bg-rose-700",
};

export const editor48Demo: Editor48Props = {
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
  className,
}: Editor48Props) {
  const hasUrlSection = Boolean(
    headerLabel || changeLabel || url || verifiedLabel
  );
  const hasTextBlock = Boolean(changesTitle || changesDescription);
  const hasChangesSection = hasTextBlock || Boolean(logLabel);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-xs flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
        {hasUrlSection && (
          <div className="flex flex-col gap-2">
            {(headerLabel || changeLabel) && (
              <div className="flex items-center justify-between gap-2">
                {headerLabel && (
                  <span className="text-sm font-medium text-card-foreground">
                    {headerLabel}
                  </span>
                )}
                {changeLabel && (
                  <button
                    type="button"
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-card-foreground"
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
                  className="size-3.5 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="truncate text-xs text-card-foreground">
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
                  <span className="text-sm font-medium text-card-foreground">
                    {changesTitle}
                  </span>
                )}
                {changesDescription && (
                  <p className="text-xs text-muted-foreground">
                    {changesDescription}
                  </p>
                )}
              </div>
            )}
            {logLabel && (
              <button
                type="button"
                className="self-start text-xs font-medium text-card-foreground hover:underline"
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
