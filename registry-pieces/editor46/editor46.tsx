"use client";

import { ChevronDown, Menu, MoreHorizontal, X } from "lucide-react";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Editor46Props {
  componentId?: string;
  componentTag?: string;
  locale?: string;
  sectionLabel?: string;
  sizeLabel?: string;
  headingLabel?: string;
  heading?: string;
  descriptionLabel?: string;
  description?: string;
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

export const editor46Demo: Editor46Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  componentId: "Feature177 Content",
  componentTag: "#feature177",
  locale: "🇺🇸",
  sizeLabel: "Size",
  headingLabel: "Heading",
  heading: "No tutorials needed.",
  descriptionLabel: "Description",
  description:
    "If you can order food online, you can build a website with Beste.",
};

function Toolbar({
  leadLetter,
  sizeLabel,
}: {
  leadLetter: string;
  sizeLabel: string;
}) {
  return (
    <div className="flex items-center gap-0.5 border-b border-current/15 px-2 py-1.5 text-xs text-current/60">
      <button
        type="button"
        className="flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-current/10"
      >
        <span className="font-semibold">
          {leadLetter}
        </span>
        <span>{sizeLabel}</span>
      </button>
      <span className="mx-1 h-4 w-px bg-border" aria-hidden="true" />
      <button
        type="button"
        className="rounded px-1.5 py-0.5 font-serif font-bold hover:bg-current/10"
        aria-label="Bold"
      >
        B
      </button>
      <button
        type="button"
        className="rounded px-1.5 py-0.5 font-serif italic hover:bg-current/10"
        aria-label="Italic"
      >
        I
      </button>
      <button
        type="button"
        className="rounded px-1.5 py-0.5 font-serif underline hover:bg-current/10"
        aria-label="Underline"
      >
        U
      </button>
      <button
        type="button"
        className="rounded p-1 hover:bg-current/10"
        aria-label="More formatting"
      >
        <MoreHorizontal className="size-3" aria-hidden="true" />
      </button>
      <span className="mx-1 h-4 w-px bg-border" aria-hidden="true" />
      <button
        type="button"
        className="flex items-center gap-0.5 rounded px-1 py-0.5 hover:bg-current/10"
        aria-label="Text color"
      >
        <span className="border-b-2 border-foreground text-xs font-semibold leading-none">
          A
        </span>
        <ChevronDown className="size-3" aria-hidden="true" />
      </button>
    </div>
  );
}

export function Editor46({
  componentId,
  componentTag,
  locale,
  sizeLabel = "Size",
  headingLabel,
  heading,
  descriptionLabel,
  description,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Editor46Props) {
  const trimmedHeading = heading?.trim();
  const trimmedDescription = description?.trim();
  const hasHeading = Boolean(trimmedHeading);
  const hasDescription = Boolean(trimmedDescription);
  const hasBody = hasHeading || hasDescription;

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
          "w-full max-w-xs overflow-hidden rounded-xl shadow-lg",
          surfaceTone,
          bordered && "border border-current/15"
        )}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <Menu
              className="size-4 shrink-0 text-current/60"
              aria-hidden="true"
            />
            {componentId && (
              <span className="truncate text-sm font-semibold">
                {componentId}
              </span>
            )}
            {componentTag && (
              <span className="truncate text-sm text-current/60">
                {componentTag}
              </span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {locale && (
              <button
                type="button"
                className="flex size-7 items-center justify-center overflow-hidden rounded-full border border-current/15 bg-background text-foreground"
                aria-label="Locale"
              >
                <span className="text-base leading-none" aria-hidden="true">
                  {locale}
                </span>
              </button>
            )}
            <button
              type="button"
              className="flex size-7 items-center justify-center rounded-full border border-current/15 bg-background text-foreground/60 hover:bg-current/10"
              aria-label="Close"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {hasBody && (
          <div className="space-y-3 px-4 pb-4">
           

            {hasHeading && (
              <div className="space-y-1.5">
                {headingLabel && (
                  <span className="text-xs text-current/60">
                    {headingLabel}
                  </span>
                )}
                <div className="overflow-hidden rounded-lg border border-current/15 bg-background text-foreground">
                  <Toolbar leadLetter="H2" sizeLabel={sizeLabel} />
                  <div className="p-3">
                    <p className="text-lg font-medium leading-snug">
                      {trimmedHeading}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {hasDescription && (
              <div className="space-y-1.5">
                {descriptionLabel && (
                  <span className="text-xs text-current/60">
                    {descriptionLabel}
                  </span>
                )}
                <div className="overflow-hidden rounded-lg border border-current/15 bg-background text-foreground">
                  <Toolbar leadLetter="P" sizeLabel={sizeLabel} />
                  <div className="p-3">
                    <p className="text-sm leading-relaxed">
                      {trimmedDescription}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
