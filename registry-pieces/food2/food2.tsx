"use client";
import { Clock, MapPin, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Food2Props {
  name?: string;
  cuisine?: string;
  neighborhood?: string;
  rating?: string;
  priceRange?: string;
  eta?: string;
  imageSrc?: string;
  alt?: string;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const defaultImage =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=640&q=80";


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

export const food2Demo: Food2Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  name: "Lokal · Modern Türk",
  cuisine: "Anatolian · Small plates",
  neighborhood: "Karaköy",
  rating: "4.7",
  priceRange: "₺₺₺",
  eta: "30–45 min",
  imageSrc: defaultImage,
  alt: "Lokal · dining room",
};

export function Food2({
  name,
  cuisine,
  neighborhood,
  rating,
  priceRange,
  eta,
  imageSrc = defaultImage,
  alt,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Food2Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col overflow-hidden rounded-xl shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="relative aspect-video w-full overflow-hidden bg-current/10">
          <img
            src={imageSrc}
            alt={alt ?? name ?? ""}
            className="absolute inset-0 size-full object-cover"
          />
          <span className="absolute bottom-2 left-2 rounded-full bg-background/90 px-2 py-0.5 text-xs font-semibold backdrop-blur text-foreground">
            {cuisine}
          </span>
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 text-xs font-semibold backdrop-blur text-foreground">
            <Star
              className="size-3 fill-amber-400 text-amber-400"
              aria-hidden="true"
            />
            {rating}
          </span>
        </div>
        <div className="flex flex-col gap-1 p-3">
          {name && (
            <span className="truncate text-sm font-semibold">
              {name}
            </span>
          )}
          <div className="flex items-center gap-3 text-xs text-current/60">
            {neighborhood && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3" aria-hidden="true" />
                {neighborhood}
              </span>
            )}
            {eta && (
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3" aria-hidden="true" />
                {eta}
              </span>
            )}
            {priceRange && <span className="font-mono">{priceRange}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
