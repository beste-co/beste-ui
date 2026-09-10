"use client";
import { Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Commerce1Props {
  image?: string;
  name?: string;
  price?: string;
  rating?: number;
  reviews?: number;
  tag?: string;
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

export const commerce1Demo: Commerce1Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  image:
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=512&auto=format&fit=crop",
  name: "Air Max 90 Essential",
  price: "$129",
  rating: 4.7,
  reviews: 284,
  tag: "New",
};

export function Commerce1({
  image,
  name = "Product",
  price = "$0",
  rating,
  reviews,
  tag,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Commerce1Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-56 flex-col overflow-hidden rounded-md shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="relative aspect-square bg-current/10">
          {image && (
            <img
              src={image}
              alt={name}
              className="absolute inset-0 size-full object-cover"
            />
          )}
          {tag && (
            <span className="absolute left-2 top-2 rounded-sm bg-foreground px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-background">
              {tag}
            </span>
          )}
          <button
            type="button"
            className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-card/90 text-muted-foreground shadow-sm backdrop-blur-sm hover:text-rose-500"
            aria-label="Save"
          >
            <Heart className="size-3.5" />
          </button>
        </div>
        <div className="flex flex-col gap-1 p-2.5">
          <span className="truncate text-xs font-semibold">
            {name}
          </span>
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-mono text-sm font-semibold tabular-nums">
              {price}
            </span>
            {typeof rating === "number" && (
              <span className="flex items-center gap-0.5 text-xs text-current/60">
                <Star
                  className="size-3 fill-amber-500 text-amber-500"
                  aria-hidden="true"
                />
                <span className="font-mono tabular-nums">{rating}</span>
                {typeof reviews === "number" && (
                  <span className="font-mono tabular-nums">({reviews})</span>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
