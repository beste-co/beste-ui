"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Form40Props {
  domain?: string;
  title?: string;
  placeholder?: string;
  submitLabel?: string;
  note?: string;
  /** How many characters the field fills up to before it rests. */
  length?: number;
  stepMs?: number;
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

export const form40Demo: Form40Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  domain: "yourdomain.com",
  title: "This site is private",
  placeholder: "Enter a password",
  submitLabel: "Apply",
  note: "Every page is covered, not only this one.",
  length: 8,
  stepMs: 190,
};

/* The field holds one line whether it is empty or full: the placeholder and the
   dots occupy the same row, so nothing under them moves as it fills. */
const STYLES = `
@keyframes form40-dot { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: none; } }
.form40-dot { animation: form40-dot 180ms ease-out both; }
@media (prefers-reduced-motion: reduce) { .form40-dot { animation: none; } }
`;

export function Form40({
  domain,
  title,
  placeholder,
  submitLabel,
  note,
  length = 8,
  stepMs = 190,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Form40Props) {
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (typed >= length) return;
    const id = setTimeout(() => setTyped((value) => value + 1), stepMs);
    return () => clearTimeout(id);
  }, [typed, length, stepMs]);

  const filled = typed > 0;

  const tone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{STYLES}</style>

      <div
        className={cn(
          "flex w-full max-w-72 flex-col gap-3 rounded-xl p-4 shadow-sm",
          tone,
          bordered && "border border-current/15"
        )}
      >
        <div className="flex flex-col items-center gap-1.5 text-center">
          <span
            className="flex size-8 items-center justify-center rounded-full bg-current/10"
            aria-hidden="true"
          >
            <Lock className="size-3.5 opacity-60" />
          </span>
          {title && (
            <h3 className="text-sm font-semibold">
              {title}
            </h3>
          )}
          {domain && (
            <span className="font-mono text-xs opacity-60">
              {domain}
            </span>
          )}
        </div>

        <div className="flex h-8 items-center gap-1 rounded-md border border-current/15 bg-background px-2.5">
          {!filled && placeholder && (
            <span className="text-xs opacity-60">{placeholder}</span>
          )}
          {filled &&
            Array.from({ length: typed }).map((_, index) => (
              <span
                key={index}
                className="form40-dot size-1.5 rounded-full bg-current"
                aria-hidden="true"
              />
            ))}
        </div>

        {submitLabel && (
          <button
            type="button"
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-300 motion-reduce:transition-none",
              typed >= length
                ? inverted
                  ? "bg-background text-foreground"
                  : "bg-foreground text-background"
                : "bg-current/10 opacity-60"
            )}
          >
            {submitLabel}
          </button>
        )}

        {note && (
          <p className="text-center text-xs opacity-60">{note}</p>
        )}
      </div>
    </div>
  );
}
