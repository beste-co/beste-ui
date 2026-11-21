"use client";

import { cn } from "@/lib/utils";

interface Commerce41Listing {
  image?: string;
  /** A small white pill on the photo, e.g. "For rent" */
  tag?: string;
  title: string;
  price?: string;
}

interface Commerce41Props {
  title?: string;
  count?: string;
  listing?: Commerce41Listing;
  /** The next listing, on a ruled line at the foot */
  next?: { title: string; price?: string };
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const commerce41Demo: Commerce41Props = {
  title: "Listings",
  listing: {
    image: "https://oud.pics/b/beste/oriel-consultation.webp",
    tag: "For rent",
    title: "Two-bed flat, Alfama",
    price: "€1,450",
  },
  next: { title: "Graça, three-bed", price: "€2,100" },
  framed: true,
};

export function Commerce41({ title, count, listing, next, framed = true, fill = false, className }: Commerce41Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-80",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-3 overflow-hidden rounded-2xl bg-card p-4 text-sm text-card-foreground", !framed && "ring-1 ring-border")}>
          {(title || count) && (
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-semibold">{title}</span>
              {count && <span className="text-xs text-muted-foreground">{count}</span>}
            </div>
          )}
          {listing && (
            <>
              {listing.image && (
                <div className="relative">
                  <img src={listing.image} alt="" aria-hidden="true" className="h-32 w-full rounded-lg bg-muted object-cover" />
                  {listing.tag && <span className="absolute top-2 left-2 rounded-full bg-card px-2 py-0.5 text-xs">{listing.tag}</span>}
                </div>
              )}
              <div>
                <div className="flex justify-between gap-2 font-medium">
                  <span className="truncate">{listing.title}</span>
                  {listing.price && <span className="shrink-0">{listing.price}</span>}
                </div>
              </div>
            </>
          )}
          {next && (
            <div className="mt-auto flex justify-between gap-2 border-t border-border pt-2.5 text-xs text-muted-foreground">
              <span className="truncate">{next.title}</span>
              {next.price && <span className="shrink-0 text-foreground">{next.price}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
