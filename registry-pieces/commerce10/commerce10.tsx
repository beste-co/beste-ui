"use client";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface Commerce10Props {
  image?: string;
  name?: string;
  price?: string;
  saved?: boolean;
  savedCount?: number;
  className?: string;
}

export const commerce10Demo: Commerce10Props = {
  image:
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=256&auto=format&fit=crop",
  name: "Field Leather Backpack",
  price: "$340",
  saved: true,
  savedCount: 1284,
};

export function Commerce10({
  image,
  name = "Product",
  price = "$0",
  saved = false,
  savedCount,
  className,
}: Commerce10Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-3 rounded-md border border-border bg-card p-2.5 shadow-sm">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-sm bg-muted">
          {image && (
            <img
              src={image}
              alt={name}
              className="absolute inset-0 size-full object-cover"
            />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-xs font-semibold text-card-foreground">
            {name}
          </span>
          <span className="font-mono text-sm tabular-nums text-card-foreground">
            {price}
          </span>
        </div>
        <button
          type="button"
          aria-pressed={saved}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
            saved
              ? "border-rose-500/50 bg-rose-500/10 text-rose-600 dark:text-rose-400"
              : "border-border bg-card text-card-foreground hover:bg-muted"
          )}
        >
          <Heart
            className={cn(
              "size-3.5",
              saved && "fill-rose-500 text-rose-500"
            )}
            aria-hidden="true"
          />
          {saved ? "Saved" : "Save"}
          {typeof savedCount === "number" && (
            <span className="font-mono tabular-nums opacity-80">
              {savedCount.toLocaleString()}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
