"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "primary" | "foreground";

interface Tooltip4Props {
  title?: string;
  description?: string;
  action?: string;
  tone?: Tone;
  className?: string;
}

const cardClasses: Record<Tone, string> = {
  neutral: "border border-border bg-card text-card-foreground",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
};

const arrowClasses: Record<Tone, string> = {
  neutral: "border-b border-l border-border bg-card",
  primary: "bg-primary",
  foreground: "bg-foreground",
};

export const tooltip4Demo: Tooltip4Props = {
  title: "Try the new AI rewrite",
  description: "Polish any paragraph in one click. Available in the editor.",
  action: "Learn more",
  tone: "foreground",
};

export function Tooltip4({
  title,
  description,
  action,
  tone = "foreground",
  className,
}: Tooltip4Props) {
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
            "flex w-64 flex-col gap-2 rounded-lg p-3 shadow-xl",
            cardClasses[tone]
          )}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="size-3.5 opacity-80" aria-hidden="true" />
            {title && (
              <span className="text-xs font-semibold">{title}</span>
            )}
          </div>
          {description && (
            <span className="text-xs leading-snug opacity-70">
              {description}
            </span>
          )}
          {action && (
            <button
              type="button"
              className="inline-flex items-center gap-1 self-start text-xs font-semibold hover:underline"
            >
              {action}
              <ArrowRight className="size-3" aria-hidden="true" />
            </button>
          )}
        </div>
        <div
          className={cn(
            "absolute -bottom-1 left-6 size-2 rotate-45",
            arrowClasses[tone]
          )}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
