"use client";

import { ChevronDown, Menu, MoreHorizontal, X } from "lucide-react";

import { cn } from "@/lib/utils";

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
  className?: string;
}

export const editor46Demo: Editor46Props = {
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
    <div className="flex items-center gap-0.5 border-b border-border px-2 py-1.5 text-xs text-muted-foreground">
      <button
        type="button"
        className="flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-muted"
      >
        <span className="font-semibold text-card-foreground">
          {leadLetter}
        </span>
        <span>{sizeLabel}</span>
      </button>
      <span className="mx-1 h-4 w-px bg-border" aria-hidden="true" />
      <button
        type="button"
        className="rounded px-1.5 py-0.5 font-serif font-bold text-card-foreground hover:bg-muted"
        aria-label="Bold"
      >
        B
      </button>
      <button
        type="button"
        className="rounded px-1.5 py-0.5 font-serif italic text-card-foreground hover:bg-muted"
        aria-label="Italic"
      >
        I
      </button>
      <button
        type="button"
        className="rounded px-1.5 py-0.5 font-serif text-card-foreground underline hover:bg-muted"
        aria-label="Underline"
      >
        U
      </button>
      <button
        type="button"
        className="rounded p-1 hover:bg-muted"
        aria-label="More formatting"
      >
        <MoreHorizontal className="size-3" aria-hidden="true" />
      </button>
      <span className="mx-1 h-4 w-px bg-border" aria-hidden="true" />
      <button
        type="button"
        className="flex items-center gap-0.5 rounded px-1 py-0.5 hover:bg-muted"
        aria-label="Text color"
      >
        <span className="border-b-2 border-foreground text-xs font-semibold leading-none text-card-foreground">
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
  className,
}: Editor46Props) {
  const trimmedHeading = heading?.trim();
  const trimmedDescription = description?.trim();
  const hasHeading = Boolean(trimmedHeading);
  const hasDescription = Boolean(trimmedDescription);
  const hasBody = hasHeading || hasDescription;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-xs overflow-hidden rounded-xl border border-border bg-card shadow-lg">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <Menu
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            {componentId && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {componentId}
              </span>
            )}
            {componentTag && (
              <span className="truncate text-sm text-muted-foreground">
                {componentTag}
              </span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {locale && (
              <button
                type="button"
                className="flex size-7 items-center justify-center overflow-hidden rounded-full border border-border bg-background"
                aria-label="Locale"
              >
                <span className="text-base leading-none" aria-hidden="true">
                  {locale}
                </span>
              </button>
            )}
            <button
              type="button"
              className="flex size-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:bg-muted"
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
                  <span className="text-xs text-muted-foreground">
                    {headingLabel}
                  </span>
                )}
                <div className="overflow-hidden rounded-lg border border-border bg-background">
                  <Toolbar leadLetter="H2" sizeLabel={sizeLabel} />
                  <div className="p-3">
                    <p className="text-lg font-medium leading-snug text-card-foreground">
                      {trimmedHeading}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {hasDescription && (
              <div className="space-y-1.5">
                {descriptionLabel && (
                  <span className="text-xs text-muted-foreground">
                    {descriptionLabel}
                  </span>
                )}
                <div className="overflow-hidden rounded-lg border border-border bg-background">
                  <Toolbar leadLetter="P" sizeLabel={sizeLabel} />
                  <div className="p-3">
                    <p className="text-sm leading-relaxed text-card-foreground">
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
