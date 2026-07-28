"use client";

import { Heart, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber"
  | "rose";

interface Card10Props {
  name?: string;
  tag?: string;
  price?: string;
  original?: string;
  image?: string;
  tone?: Tone;
  className?: string;
}

const thumbClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground/60",
  foreground: "bg-foreground text-background/60",
  violet:
    "bg-gradient-to-br from-violet-200 via-fuchsia-200 to-rose-200 text-violet-800/60",
  emerald:
    "bg-gradient-to-br from-emerald-200 via-teal-200 to-sky-200 text-emerald-800/60",
  sky: "bg-gradient-to-br from-sky-200 via-indigo-200 to-violet-200 text-sky-800/60",
  amber:
    "bg-gradient-to-br from-amber-200 via-rose-200 to-orange-200 text-amber-800/60",
  rose: "bg-gradient-to-br from-rose-200 via-pink-200 to-orange-200 text-rose-800/60",
};

export const card10Demo: Card10Props = {
  name: "Linen boucle cushion",
  tag: "Limited run",
  price: "$48",
  original: "$64",
  image:
    "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&auto=format&fit=crop",
  tone: "amber",
};

export function Card10({
  name,
  tag,
  price,
  original,
  image,
  tone = "amber",
  className,
}: Card10Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-64 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div
          className={cn(
            "relative flex aspect-video items-center justify-center",
            thumbClasses[tone]
          )}
        >
          {image ? (
            <img
              src={image}
              alt={name ?? ""}
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            <ShoppingBag className="size-8" aria-hidden="true" />
          )}
          {tag && (
            <span className="absolute left-2 top-2 rounded-full bg-card/80 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-card-foreground backdrop-blur">
              {tag}
            </span>
          )}
          <button
            type="button"
            className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-card/90 text-muted-foreground backdrop-blur hover:text-rose-500"
            aria-label="Save"
          >
            <Heart className="size-3.5" aria-hidden="true" />
          </button>
        </div>
        <div className="flex flex-col gap-1 p-3">
          {name && (
            <span className="truncate text-sm font-semibold text-card-foreground">
              {name}
            </span>
          )}
          <div className="flex items-baseline gap-2">
            {price && (
              <span className="font-mono text-base font-bold text-card-foreground">
                {price}
              </span>
            )}
            {original && (
              <span className="font-mono text-xs text-muted-foreground line-through">
                {original}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
