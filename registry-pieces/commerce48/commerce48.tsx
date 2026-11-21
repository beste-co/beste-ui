"use client";

import { cn } from "@/lib/utils";

interface Commerce48Listing {
  image?: string;
  /** A small white pill on the photo, e.g. "New" */
  tag?: string;
  title: string;
  /** A quiet line under the title, e.g. the city */
  location?: string;
  price?: string;
  /** A quiet line under the price, e.g. rooms and size */
  facts?: string;
}

interface Commerce48Props {
  title?: string;
  /** Quiet text beside the title, e.g. the agency */
  meta?: string;
  listings?: Commerce48Listing[];
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Take the slot's full width instead of a card-sized box */
  fill?: boolean;
  className?: string;
}

export const commerce48Demo: Commerce48Props = {
  title: "Featured Listings",
  listings: [
    { image: "https://oud.pics/b/beste/oriel-consultation.webp", tag: "Popular", title: "Maple Ridge Estate", price: "$2,450,000", facts: "4 bd · 3 ba · 3,200 sqft" },
    { image: "https://oud.pics/b/beste/oriel-studio.webp", tag: "New", title: "Harbourfront Condo", price: "$1,150,000", facts: "2 bd · 2 ba · 1,450 sqft" },
    { image: "https://oud.pics/b/beste/oriel-consultation.webp", tag: "Opportunity", title: "Rocky Mountain Retreat", price: "$1,680,000", facts: "3 bd · 2 ba · 2,100 sqft" },
    { image: "https://oud.pics/b/beste/oriel-studio.webp", tag: "Exclusive", title: "Whistler Chalet", price: "$3,250,000", facts: "5 bd · 4 ba · 4,500 sqft" },
  ],
  framed: true,
};

export function Commerce48({ title, meta, listings = [], framed = true, fill = false, className }: Commerce48Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-215",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-4.5 rounded-2xl bg-card p-4 text-card-foreground md:p-6", !framed && "shadow-lg")}>
          {(title || meta) && (
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              {title && <span className="text-xl font-medium tracking-tight">{title}</span>}
              {meta && <span className="text-xs text-muted-foreground">{meta}</span>}
            </div>
          )}
          {listings.length > 0 && (
            <div className="grid gap-3.5 sm:grid-cols-2 md:grid-cols-4">
              {listings.map((listing, index) => (
                <div key={index} className="flex min-w-0 flex-col gap-2">
                  <div className="relative">
                    {listing.image ? (
                      <img src={listing.image} alt="" aria-hidden="true" className="h-32 w-full rounded-lg bg-muted object-cover" />
                    ) : (
                      <div aria-hidden="true" className="h-32 w-full rounded-lg bg-muted" />
                    )}
                    {listing.tag && <span className="absolute top-2 left-2 rounded-full bg-card px-2 py-0.5 text-xs">{listing.tag}</span>}
                  </div>
                  <div>
                    <div className="truncate text-sm font-medium tracking-tight">{listing.title}</div>
                    {listing.location && <div className="truncate text-xs text-muted-foreground">{listing.location}</div>}
                  </div>
                  {(listing.price || listing.facts) && (
                    <div className="flex flex-col gap-0.5 border-t border-border pt-2">
                      {listing.price && <span className="text-sm">{listing.price}</span>}
                      {listing.facts && <span className="truncate text-xs text-muted-foreground">{listing.facts}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
