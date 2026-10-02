"use client";

// Live-preview grid for related pieces/components. Mirrors the card used on the
// listing pages — a muted panel holding the demo on a surface of its own — so a
// related item looks like the same thing it looks like in the catalogue.
import type { ComponentType } from "react";
import Link from "next/link";
import { SourceCodeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CardDemo } from "@/components/card-demo";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

export interface RelatedPreviewItem {
  name: string;
  title: string;
  description: string;
  component: ComponentType<any>;
  demoProps: any;
  href: string;
  /** Decides how the demo sits in the card: backgrounds fill it, large surfaces are fitted. */
  category?: string;
  fullBleed?: boolean;
  /** Size of the demo in the card, from the meta file. */
  cardScale?: number;
}

export function RelatedPreviewGrid({ items }: { items: RelatedPreviewItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((c) => {
        return (
          /*
            The same card as the catalog grid: one overlay link covering it, a
            sibling of the demo rather than its ancestor, since a demo can contain
            anchors of its own and a parser will not keep one inside another.
          */
          <div
            key={c.name}
            className="group relative flex flex-col gap-3 rounded-xl bg-muted p-3 transition-colors hover:bg-muted-foreground/15 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring"
          >
            <Link
              href={c.href}
              aria-label={c.title}
              className="absolute inset-0 z-10 rounded-xl outline-none"
            />
            <div
              // `inert`: the live demo is a non-interactive preview. Without it,
              // a demo that autofocuses an input on mount steals focus and the
              // browser scrolls to it — very visible on /search as results
              // change while typing. inert also implies pointer-events:none, so
              // clicks still fall through to the card's navigation.
              inert
              className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md bg-background"
            >
              <CardDemo entry={c} />
              <div
                className="pointer-events-none absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              >
                <HugeiconsIcon icon={SourceCodeIcon} size={14} strokeWidth={2} />
              </div>
            </div>
            {/* Title alone: the registry name is what you type into a terminal, not
                what you scan a grid for, and the card's overlay already carries the
                accessible name. */}
            <div className="relative flex flex-col gap-1 px-1 pb-1">
              <h3 className={typography.cardTitle}>{c.title}</h3>
              <p className={cn(typography.cardText, "line-clamp-2")}>{c.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
