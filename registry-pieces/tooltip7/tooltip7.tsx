"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "primary" | "foreground";

interface Tooltip7Props {
  step?: number;
  total?: number;
  title?: string;
  description?: string;
  nextLabel?: string;
  tone?: Tone;
  className?: string;
}

const cardClasses: Record<Tone, string> = {
  neutral: "border border-border bg-card text-card-foreground",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
};

const pillClasses: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground",
  primary: "bg-primary-foreground/15",
  foreground: "bg-background/15",
};

const arrowClasses: Record<Tone, string> = {
  neutral: "border-b border-l border-border bg-card",
  primary: "bg-primary",
  foreground: "bg-foreground",
};

const buttonClasses: Record<Tone, string> = {
  neutral: "bg-foreground text-background",
  primary: "bg-primary-foreground text-primary",
  foreground: "bg-background text-foreground",
};

const dotActive: Record<Tone, string> = {
  neutral: "bg-foreground",
  primary: "bg-primary-foreground",
  foreground: "bg-background",
};

const dotInactive: Record<Tone, string> = {
  neutral: "bg-muted-foreground/30",
  primary: "bg-primary-foreground/30",
  foreground: "bg-background/30",
};

export const tooltip7Demo: Tooltip7Props = {
  step: 2,
  total: 4,
  title: "Pin your favorite workspaces",
  description:
    "Drag any workspace into the sidebar rail to keep it one click away.",
  nextLabel: "Next",
  tone: "primary",
};

export function Tooltip7({
  step = 1,
  total = 1,
  title,
  description,
  nextLabel = "Next",
  tone = "primary",
  className,
}: Tooltip7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="relative">
        <div
          className={cn(
            "flex w-72 flex-col gap-3 rounded-lg p-3 shadow-xl",
            cardClasses[tone]
          )}
        >
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-semibold",
                pillClasses[tone]
              )}
            >
              Step {step} of {total}
            </span>
            <button
              type="button"
              className={cn(
                "flex size-5 items-center justify-center rounded hover:opacity-80",
                pillClasses[tone]
              )}
              aria-label="Dismiss"
            >
              <X className="size-3" aria-hidden="true" />
            </button>
          </div>
          {title && <span className="text-sm font-semibold">{title}</span>}
          {description && (
            <span className="text-xs leading-snug opacity-80">
              {description}
            </span>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1" aria-hidden="true">
              {Array.from({ length: total }).map((_, idx) => (
                <span
                  key={idx}
                  className={cn(
                    "size-1.5 rounded-full",
                    idx < step ? dotActive[tone] : dotInactive[tone]
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              className={cn(
                "rounded-md px-3 py-1 text-xs font-semibold hover:opacity-90",
                buttonClasses[tone]
              )}
            >
              {nextLabel}
            </button>
          </div>
        </div>
        <div
          className={cn(
            "absolute -bottom-1 left-8 size-2 rotate-45",
            arrowClasses[tone]
          )}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
