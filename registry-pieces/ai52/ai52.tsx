"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Ai52Props {
  title?: string;
  subject?: string;
  allowed?: string[];
  deniedLabel?: string;
  denied?: string;
  approveLabel?: string;
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

export const ai52Demo: Ai52Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  title: "Give Claude access",
  subject: "yourdomain.com",
  allowed: ["Read every page", "Write into your draft", "Add pages and posts"],
  deniedLabel: "Never",
  denied: "Publish to the live site",
  approveLabel: "Approve",
  stepMs: 400,
};

/* Every line is laid out from the first frame; the ticks and the crossed line
   fade into places that were already reserved for them. */
const STYLES = `
@keyframes ai52-in { from { opacity: 0; transform: translateX(0.375rem); } to { opacity: 1; transform: none; } }
.ai52-in { animation: ai52-in 300ms ease-out both; }
@media (prefers-reduced-motion: reduce) { .ai52-in { animation: none; } }
`;

export function Ai52({
  title,
  subject,
  allowed = [],
  deniedLabel = "Never",
  denied,
  approveLabel,
  stepMs = 400,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Ai52Props) {
  const total = allowed.length + 1;
  const [granted, setGranted] = useState(0);

  useEffect(() => {
    if (granted >= total) return;
    const id = setTimeout(() => setGranted((value) => value + 1), stepMs);
    return () => clearTimeout(id);
  }, [granted, total, stepMs]);

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
        <div className="flex items-baseline justify-between gap-3">
          {title && (
            <h3 className="truncate text-sm font-semibold">
              {title}
            </h3>
          )}
          {subject && (
            <span className="shrink-0 font-mono text-xs opacity-60">
              {subject}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          {allowed.map((item, index) => (
            <div
              key={item}
              className={cn(
                "flex items-center gap-2",
                index < granted ? "ai52-in" : "invisible"
              )}
            >
              <Check
                className={cn(
                  "size-3.5 shrink-0",
                  inverted ? "text-emerald-400" : "text-emerald-600 dark:text-emerald-400"
                )}
                aria-hidden="true"
              />
              <span className="truncate text-xs">
                {item}
              </span>
            </div>
          ))}

          {denied && (
            <div
              className={cn(
                "flex items-center gap-2 rounded-md bg-current/10 px-2 py-1.5",
                granted > allowed.length ? "ai52-in" : "invisible"
              )}
            >
              <X
                className="size-3.5 shrink-0 opacity-60"
                aria-hidden="true"
              />
              <span className="truncate text-xs">
                <span className="opacity-60">{deniedLabel} </span>
                {denied}
              </span>
            </div>
          )}
        </div>

        {approveLabel && (
          <button
            type="button"
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-300 motion-reduce:transition-none",
              granted >= total
                ? inverted
                  ? "bg-background text-foreground"
                  : "bg-foreground text-background"
                : "bg-current/10 opacity-60"
            )}
          >
            {approveLabel}
          </button>
        )}
      </div>
    </div>
  );
}
