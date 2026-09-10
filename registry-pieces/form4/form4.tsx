"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Form4Props {
  label?: string;
  requiredLabel?: string;
  placeholder?: string;
  value?: string;
  hint?: string;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}


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

export const form4Demo: Form4Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  label: "Full legal name",
  requiredLabel: "Required",
  placeholder: "As shown on your ID",
  value: "Oud Beste",
  hint: "We use this for invoices and tax documents.",
};

export function Form4({
  label,
  requiredLabel = "Required",
  placeholder,
  value,
  hint,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Form4Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1.5">
        <div className="flex items-center justify-between">
          {label && (
            <label className="text-xs font-medium">
              {label}
              <span
                className="ml-0.5 text-rose-500"
                aria-hidden="true"
              >
                *
              </span>
            </label>
          )}
          <span className="rounded-full bg-rose-500/10 px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-400">
            {requiredLabel}
          </span>
        </div>
        <div className={cn("rounded-md px-3 py-2 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
          <span
            className={cn(
              "block text-sm",
              value ? "" : "text-current/60"
            )}
          >
            {value || placeholder}
          </span>
        </div>
        {hint && (
          <span className="text-xs text-current/60">{hint}</span>
        )}
      </div>
    </div>
  );
}
