"use client";

import { Blocks, Plus } from "lucide-react";

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

interface Editor47Props {
  title?: string;
  description?: string;
  buttonLabel?: string;
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

export const editor47Demo: Editor47Props = {
  title: "Your page looks empty",
  description: "Start by adding your first block.",
  buttonLabel: "Add Block",
  tone: "emerald",
};

export function Editor47({
  title,
  description,
  buttonLabel,
  tone = "emerald",
  className,
}: Editor47Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-xs flex-col items-center gap-5 rounded-xl border border-border bg-card px-6 py-10 text-center shadow-sm">
        <div
          className="flex size-10 items-center justify-center rounded-lg bg-muted"
          aria-hidden="true"
        >
          <Blocks className="size-4 text-muted-foreground" />
        </div>
        {(title || description) && (
          <div className="flex flex-col items-center gap-0.5">
            {title && (
              <span className="text-sm font-medium text-card-foreground">
                {title}
              </span>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        )}
        {buttonLabel && (
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
              buttonClasses[tone]
            )}
          >
            <Plus className="size-3.5" aria-hidden="true" />
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
}
