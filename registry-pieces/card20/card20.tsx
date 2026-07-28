"use client";

import { MapPin, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";

interface Card20Props {
  name?: string;
  role?: string;
  location?: string;
  bio?: string;
  initials?: string;
  handle?: string;
  image?: string;
  className?: string;
}

export const card20Demo: Card20Props = {
  name: "Furkan Genç",
  role: "Design lead · Beste",
  location: "Istanbul · GMT+3",
  bio: "Designing the tooling that ships millions of components every week.",
  initials: "BS",
  handle: "mira.sol",
  image:
    "https://images.unsplash.com/photo-1529068755536-a5ade0dcb4e8?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjgwfHxwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D",
};

export function Card20({
  name,
  role,
  location,
  bio,
  initials = "??",
  handle,
  image,
  className,
}: Card20Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-rose-500 text-sm font-bold text-white shadow-md">
            {image ? (
              <img
                src={image}
                alt={name ?? ""}
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {name && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {name}
              </span>
            )}
            {role && (
              <span className="truncate text-xs text-muted-foreground">
                {role}
              </span>
            )}
            {location && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" aria-hidden="true" />
                {location}
              </span>
            )}
          </div>
          {handle && (
            <button
              type="button"
              className="flex size-7 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted-foreground/10"
              aria-label={`@${handle}`}
            >
              <Twitter className="size-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
        {bio && (
          <p className="text-sm leading-snug text-muted-foreground">{bio}</p>
        )}
      </div>
    </div>
  );
}
