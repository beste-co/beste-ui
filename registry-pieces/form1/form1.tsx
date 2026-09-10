"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Form1Props {
  label?: string;
  placeholder?: string;
  value?: string;
  helper?: string;
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

export const form1Demo: Form1Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  label: "Workspace name",
  placeholder: "Beste Studio",
  value: "Mira & Co.",
  helper: "Shown on invoices and in the team directory.",
};

export function Form1({
  label,
  placeholder,
  value,
  helper,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Form1Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium">
            {label}
          </label>
        )}
        <div
          className={cn(
            "rounded-md px-3 py-2 shadow-sm",
            surfaceTone,
            bordered && "border border-current/15"
          )}
        >
          <span
            className={cn(
              "block text-sm",
              value ? "" : "text-current/60"
            )}
          >
            {value || placeholder}
          </span>
        </div>
        {helper && (
          <span className="text-xs text-current/60">{helper}</span>
        )}
      </div>
    </div>
  );
}
