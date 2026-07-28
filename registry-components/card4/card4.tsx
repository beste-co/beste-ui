"use client";

import { Heart, Star } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "dark" | "primary";

interface Card4Props {
  /** Product image URL */
  src: string;
  /** Product name */
  name: string;
  /** Current price (e.g. "$249") */
  price: string;
  /** Original price, rendered struck through (e.g. "$320") */
  compareAt?: string;
  /** Corner badge (e.g. "New" or "-22%") */
  badge?: string;
  /** Rating value shown next to a star (e.g. 4.8) */
  rating?: number;
  /** If set, the image and name link to this href */
  href?: string;
  /** CTA label (defaults to "Add to cart") */
  ctaLabel?: string;
  /** CTA click handler */
  onAdd?: React.MouseEventHandler<HTMLButtonElement>;
  /** Called when the wishlist heart is toggled */
  onWishlist?: (wishlisted: boolean) => void;
  /** CTA tone */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  dark: "bg-foreground text-background hover:bg-foreground/90",
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
};

export const card4Demo: Card4Props = {
  src: "https://images.unsplash.com/photo-1782231609423-e3cbc454d761?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  name: "Atlas Field Watch",
  price: "$249",
  compareAt: "$320",
  badge: "-22%",
  rating: 4.8,
};

/**
 * An e-commerce product card: image with hover zoom, discount badge, wishlist
 * heart, price with compare-at strike through, and an add to cart CTA. The
 * image and name link out when href is set; the buttons stay independently
 * clickable above the stretched link.
 */
export function Card4({
  src,
  name,
  price,
  compareAt,
  badge,
  rating,
  href,
  ctaLabel = "Add to cart",
  onAdd,
  onWishlist,
  tone = "dark",
  className,
}: Card4Props) {
  const [wishlisted, setWishlisted] = React.useState(false);

  const toggleWishlist = () => {
    const next = !wishlisted;
    setWishlisted(next);
    onWishlist?.(next);
  };

  return (
    <div
      className={cn(
        "group/card4 relative w-full max-w-xs overflow-hidden rounded-xl border bg-card",
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={src}
          alt={name}
          className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover/card4:scale-105"
        />
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-foreground px-2.5 py-0.5 text-sm font-semibold text-background">
            {badge}
          </span>
        )}
        <button
          type="button"
          onClick={toggleWishlist}
          aria-pressed={wishlisted}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-3 top-3 z-10 flex size-9 cursor-pointer items-center justify-center rounded-full border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Heart
            className={cn("size-4 transition-colors", wishlisted && "fill-rose-500 text-rose-500")}
          />
        </button>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-base font-semibold text-card-foreground">
            {href ? (
              <a
                href={href}
                className="rounded-sm before:absolute before:inset-0 before:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {name}
              </a>
            ) : (
              name
            )}
          </h3>
          {rating !== undefined && (
            <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-card-foreground">
              <Star aria-hidden="true" className="size-3.5 fill-current text-amber-400" />
              {rating}
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-card-foreground">{price}</span>
          {compareAt && (
            <span className="text-sm text-muted-foreground line-through">{compareAt}</span>
          )}
        </div>
        <button
          type="button"
          onClick={onAdd}
          className={cn(
            "relative z-10 flex w-full cursor-pointer items-center justify-center rounded-lg px-4 py-2.5 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            toneStyles[tone]
          )}
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}
