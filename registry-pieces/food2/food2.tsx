"use client";
import { Clock, MapPin, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Food2Props {
  name?: string;
  cuisine?: string;
  neighborhood?: string;
  rating?: string;
  priceRange?: string;
  eta?: string;
  imageSrc?: string;
  alt?: string;
  className?: string;
}

const defaultImage =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=640&q=80";

export const food2Demo: Food2Props = {
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
  className,
}: Food2Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <img
            src={imageSrc}
            alt={alt ?? name ?? ""}
            className="absolute inset-0 size-full object-cover"
          />
          <span className="absolute bottom-2 left-2 rounded-full bg-background/90 px-2 py-0.5 text-xs font-semibold text-card-foreground backdrop-blur">
            {cuisine}
          </span>
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 text-xs font-semibold text-card-foreground backdrop-blur">
            <Star
              className="size-3 fill-amber-400 text-amber-400"
              aria-hidden="true"
            />
            {rating}
          </span>
        </div>
        <div className="flex flex-col gap-1 p-3">
          {name && (
            <span className="truncate text-sm font-semibold text-card-foreground">
              {name}
            </span>
          )}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
