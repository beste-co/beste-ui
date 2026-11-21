"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Commerce49Props {
  /** The photos of the home; the first is shown large, all of them as thumbnails */
  images?: string[];
  title?: string;
  price?: string;
  /** A quiet line under the title, e.g. place, rooms and size */
  facts?: string;
  /** Small stone chips at the foot, e.g. features of the home */
  tags?: string[];
  /** Accessible name of each thumbnail button, followed by its number */
  photoLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Take the slot's full width instead of a card-sized box */
  fill?: boolean;
  className?: string;
}

export const commerce49Demo: Commerce49Props = {
  images: [
    "https://oud.pics/b/beste/oriel-consultation.webp",
    "https://oud.pics/b/beste/oriel-studio.webp",
    "https://oud.pics/b/beste/oriel-consultation.webp",
    "https://oud.pics/b/beste/oriel-studio.webp",
  ],
  title: "Oceanfront Penthouse",
  price: "$4,250,000",
  facts: "4 bd · 3 ba · 3,200 sqft",
  tags: ["Ocean View", "Rooftop Terrace", "Concierge"],
  photoLabel: "Show photo",
  framed: true,
};

export function Commerce49({ images = [], title, price, facts, tags = [], photoLabel = "Show photo", framed = true, fill = false, className }: Commerce49Props) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? images[0];

  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-90",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-2.5 rounded-2xl bg-card p-3 text-xs text-card-foreground", !framed && "shadow-lg")}>
          {main && <img key={main} src={main} alt="" aria-hidden="true" className="h-38 w-full rounded-lg bg-muted object-cover" />}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-1.5">
              {images.slice(0, 4).map((image, index) => (
                <button
                  key={index}
                  type="button"
                  aria-pressed={active === index}
                  aria-label={`${photoLabel} ${index + 1}`}
                  onClick={() => setActive(index)}
                  className={cn("cursor-pointer rounded-lg p-0.5 transition-shadow", active === index ? "ring-1 ring-foreground/25" : "hover:ring-1 hover:ring-border")}
                >
                  <img src={image} alt="" aria-hidden="true" className="h-8.5 w-full rounded-md bg-muted object-cover" />
                </button>
              ))}
            </div>
          )}
          {(title || price) && (
            <div className="flex items-baseline justify-between gap-2 px-0.5 pt-0.5">
              <span className="truncate text-sm font-medium tracking-tight">{title}</span>
              {price && <span className="shrink-0 text-sm">{price}</span>}
            </div>
          )}
          {facts && <div className="px-0.5 text-muted-foreground">{facts}</div>}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 px-0.5 pb-0.5">
              {tags.map((tag, index) => (
                <span key={index} className="rounded-full bg-muted px-2.5 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
