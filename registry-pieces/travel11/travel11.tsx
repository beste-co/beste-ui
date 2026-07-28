"use client";

import { BedDouble, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "sky"
  | "emerald"
  | "violet"
  | "amber"
  | "rose";

interface Travel11Props {
  name?: string;
  location?: string;
  rating?: string;
  reviewCount?: string;
  pricePerNight?: string;
  perNightLabel?: string;
  image?: string;
  tone?: Tone;
  className?: string;
}

const thumbClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-500 text-white/80",
  emerald: "bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-500 text-white/80",
  violet: "bg-gradient-to-br from-violet-500 via-fuchsia-500 to-rose-500 text-white/80",
  amber: "bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white/80",
  rose: "bg-gradient-to-br from-rose-500 via-pink-500 to-orange-500 text-white/80",
};

export const travel11Demo: Travel11Props = {
  name: "Hotel Alma Soho",
  location: "Barcelona, Spain",
  rating: "4.8",
  reviewCount: "2,412 reviews",
  pricePerNight: "€184",
  perNightLabel: "/ night",
  image:
    "https://images.unsplash.com/photo-1562861844-763c4ae2e696?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  tone: "sky",
};

export function Travel11({
  name,
  location,
  rating,
  reviewCount,
  pricePerNight,
  perNightLabel,
  image,
  tone = "sky",
  className,
}: Travel11Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div
          className={cn(
            "relative flex aspect-square w-24 shrink-0 items-center justify-center",
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
            <BedDouble className="size-8" aria-hidden="true" />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-1 p-3">
          <div className="flex flex-col gap-0.5">
            {name && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {name}
              </span>
            )}
            {location && (
              <span className="truncate text-sm text-muted-foreground">
                {location}
              </span>
            )}
            {rating && (
              <span className="inline-flex items-center gap-1 text-sm">
                <Star
                  className="size-3.5 fill-amber-400 text-amber-400"
                  aria-hidden="true"
                />
                <span className="font-semibold text-card-foreground">
                  {rating}
                </span>
                {reviewCount && (
                  <span className="text-muted-foreground">
                    · {reviewCount}
                  </span>
                )}
              </span>
            )}
          </div>
          {pricePerNight && (
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-base font-bold text-card-foreground">
                {pricePerNight}
                {perNightLabel && (
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    {perNightLabel}
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
