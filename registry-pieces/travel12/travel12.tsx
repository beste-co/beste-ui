"use client";

import { Heart, MapPin, Mountain } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "rose"
  | "sunset"
  | "ocean"
  | "emerald"
  | "violet";

interface Travel12Props {
  city?: string;
  country?: string;
  tag?: string;
  trending?: string;
  savedCount?: string;
  image?: string;
  tone?: Tone;
  className?: string;
}

const fallbackClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  rose: "bg-gradient-to-br from-rose-500 via-pink-500 to-orange-500 text-white",
  sunset: "bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white",
  ocean: "bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-500 text-white",
  emerald: "bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-500 text-white",
  violet: "bg-gradient-to-br from-violet-500 via-fuchsia-500 to-rose-500 text-white",
};

export const travel12Demo: Travel12Props = {
  city: "Kyoto",
  country: "Japan",
  tag: "Culture",
  trending: "Trending this month",
  savedCount: "64.1K saves",
  image:
    "https://images.unsplash.com/photo-1505069446780-4ef442b5207f?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fGt5b3RvfGVufDB8fDB8fHww",
  tone: "rose",
};

export function Travel12({
  city,
  country,
  tag,
  trending,
  savedCount,
  image,
  tone = "rose",
  className,
}: Travel12Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "relative w-full max-w-72 overflow-hidden rounded-xl shadow-md",
          !image && fallbackClasses[tone]
        )}
      >
        <div className="relative aspect-[5/4]">
          {image ? (
            <img
              src={image}
              alt={city ?? ""}
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            <Mountain
              className="absolute right-4 top-4 size-16 text-white/20"
              aria-hidden="true"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          <button
            type="button"
            className="absolute left-3 top-3 flex size-7 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60"
            aria-label="Save"
          >
            <Heart className="size-3.5" aria-hidden="true" />
          </button>

          {tag && (
            <span className="absolute right-3 top-3 rounded-full bg-black/40 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur">
              {tag}
            </span>
          )}

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 text-white">
            <div className="flex flex-col">
              {city && <span className="text-xl font-bold">{city}</span>}
              {country && (
                <span className="inline-flex items-center gap-1 text-xs text-white/80">
                  <MapPin className="size-3" aria-hidden="true" />
                  {country}
                </span>
              )}
            </div>
            <div className="flex flex-col items-end text-xs">
              {trending && <span className="text-white/80">{trending}</span>}
              {savedCount && (
                <span className="font-semibold">{savedCount}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
