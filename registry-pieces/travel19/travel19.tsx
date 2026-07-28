"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "sunset" | "ocean" | "emerald" | "violet" | "rose";

interface Travel19Props {
  author?: string;
  role?: string;
  rating?: number;
  body?: string;
  tripType?: string;
  image?: string;
  tone?: Tone;
  className?: string;
}

const avatarClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sunset: "bg-gradient-to-br from-amber-400 to-rose-500 text-white",
  ocean: "bg-gradient-to-br from-sky-500 to-indigo-500 text-white",
  emerald: "bg-gradient-to-br from-emerald-400 to-teal-500 text-white",
  violet: "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white",
  rose: "bg-gradient-to-br from-rose-500 to-pink-500 text-white",
};

export const travel19Demo: Travel19Props = {
  author: "Andrea P.",
  role: "Solo trip · Jun 2026",
  rating: 5,
  body: "Staff remembered our names by day two. The rooftop at sunset alone is worth the trip — would book again in a heartbeat.",
  tripType: "Stayed 4 nights",
  image:
    "https://images.unsplash.com/photo-1576775068668-c147f14c36f7?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDd8fHxlbnwwfHx8fHw%3D",
  tone: "primary",
};

export function Travel19({
  author,
  role,
  rating = 0,
  body,
  tripType,
  image,
  tone = "primary",
  className,
}: Travel19Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-semibold",
              avatarClasses[tone]
            )}
          >
            {image ? (
              <img src={image} alt={author ?? ""} className="absolute inset-0 size-full object-cover" />
            ) : (
              author?.slice(0, 2).toUpperCase()
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {author && (
              <span className="truncate text-sm font-semibold text-card-foreground">{author}</span>
            )}
            {role && <span className="truncate text-sm text-muted-foreground">{role}</span>}
          </div>
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={idx}
                className={cn(
                  "size-3.5",
                  idx < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                )}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
        {body && <p className="line-clamp-3 text-sm leading-snug text-card-foreground">{body}</p>}
        {tripType && (
          <span className="border-t border-border pt-2 text-sm text-muted-foreground">
            {tripType}
          </span>
        )}
      </div>
    </div>
  );
}
