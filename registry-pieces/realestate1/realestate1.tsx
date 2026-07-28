"use client";

import { Bath, BedDouble, Heart, Square } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "sky"
  | "emerald"
  | "violet"
  | "amber"
  | "rose";

interface Realestate1Props {
  address?: string;
  city?: string;
  price?: string;
  beds?: number;
  baths?: number;
  area?: string;
  image?: string;
  tone?: Tone;
  statusLabel?: string;
  className?: string;
}

const tagClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  violet: "bg-violet-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
};

const fallbackClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-gradient-to-br from-sky-300 via-indigo-300 to-violet-300",
  emerald: "bg-gradient-to-br from-emerald-300 via-teal-300 to-sky-300",
  violet: "bg-gradient-to-br from-violet-300 via-fuchsia-300 to-rose-300",
  amber: "bg-gradient-to-br from-amber-300 via-rose-300 to-orange-300",
  rose: "bg-gradient-to-br from-rose-300 via-pink-300 to-orange-300",
};

export const realestate1Demo: Realestate1Props = {
  address: "221B Riverside Avenue",
  city: "Istanbul · Levent",
  price: "$1,240,000",
  beds: 3,
  baths: 2,
  area: "142 m²",
  image:
    "https://images.unsplash.com/photo-1676443445368-ec3798dda7f8?w=300&auto=format&fit=crop&q=80&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGlzdGFuYnVsJTIwbG9mdHxlbnwwfHwwfHx8MA%3D%3D",
  tone: "primary",
  statusLabel: "For sale",
};

export function Realestate1({
  address,
  city,
  price,
  beds = 0,
  baths = 0,
  area,
  image,
  tone = "primary",
  statusLabel = "For sale",
  className,
}: Realestate1Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div
          className={cn(
            "relative aspect-video",
            !image && fallbackClasses[tone]
          )}
        >
          {image && (
            <img
              src={image}
              alt={address ?? ""}
              className="absolute inset-0 size-full object-cover"
            />
          )}
          <span
            className={cn(
              "absolute left-2 top-2 rounded-full px-2 py-0.5 text-xs font-semibold",
              tagClasses[tone]
            )}
          >
            {statusLabel}
          </span>
          <button
            type="button"
            className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-card/90 text-muted-foreground hover:text-rose-500"
            aria-label="Save"
          >
            <Heart className="size-3.5" aria-hidden="true" />
          </button>
          <span className="absolute bottom-2 right-2 rounded-md bg-background/90 px-2 py-0.5 font-mono text-xs font-bold text-card-foreground backdrop-blur">
            {price}
          </span>
        </div>
        <div className="flex flex-col gap-1 p-3">
          {address && (
            <span className="truncate text-sm font-semibold text-card-foreground">
              {address}
            </span>
          )}
          {city && (
            <span className="truncate text-sm text-muted-foreground">
              {city}
            </span>
          )}
          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <BedDouble className="size-3" aria-hidden="true" />
              {beds}
            </span>
            <span className="inline-flex items-center gap-1">
              <Bath className="size-3" aria-hidden="true" />
              {baths}
            </span>
            <span className="inline-flex items-center gap-1">
              <Square className="size-3" aria-hidden="true" />
              {area}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
