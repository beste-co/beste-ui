"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Browser38Props {
  title?: string;
  description?: string;
  rejectLabel?: string;
  customizeLabel?: string;
  acceptLabel?: string;
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

export const browser38Demo: Browser38Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  title: "We use cookies",
  description:
    "We use cookies to improve your browsing experience and analyze site traffic.",
  rejectLabel: "Reject All",
  customizeLabel: "Customize",
  acceptLabel: "Accept All",
};

/* A banner arrives from below. Transform and opacity only, so the slot it sits
   in is the same height before and after. */
const STYLES = `
@keyframes browser38-rise { from { opacity: 0; transform: translateY(0.75rem); } to { opacity: 1; transform: none; } }
.browser38-rise { animation: browser38-rise 520ms cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.browser38-rise-late { animation: browser38-rise 520ms cubic-bezier(0.2, 0.8, 0.2, 1) 160ms both; }
@media (prefers-reduced-motion: reduce) {
  .browser38-rise, .browser38-rise-late { animation: none; }
}
`;

export function Browser38({
  title,
  description,
  rejectLabel,
  customizeLabel,
  acceptLabel,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Browser38Props) {
  const hasChoices = Boolean(rejectLabel || customizeLabel || acceptLabel);

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

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
          "browser38-rise flex w-full max-w-72 flex-col gap-2.5 rounded-xl p-4 shadow-lg",
          surfaceTone,
          bordered && "border border-current/15"
        )}
      >
        {title && (
          <span className="block text-sm font-semibold">
            {title}
          </span>
        )}

        {description && (
          <p className="text-xs leading-relaxed text-current/60">
            {description}
          </p>
        )}

        {hasChoices && (
          <div className="browser38-rise-late flex items-center gap-2">
            {rejectLabel && (
              <button
                type="button"
                className="rounded-md border border-current/15 px-2.5 py-1 text-xs font-medium"
              >
                {rejectLabel}
              </button>
            )}
            {customizeLabel && (
              <button
                type="button"
                className="px-1 text-xs font-medium text-current/60"
              >
                {customizeLabel}
              </button>
            )}
            {acceptLabel && (
              <button
                type="button"
                className={cn(
                  "ml-auto rounded-md px-2.5 py-1 text-xs font-medium",
                  inverted
                    ? "bg-background text-foreground"
                    : "bg-foreground text-background"
                )}
              >
                {acceptLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
