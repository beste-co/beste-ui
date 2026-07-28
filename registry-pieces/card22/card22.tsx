"use client";

import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface Card22Props {
  name?: string;
  handle?: string;
  bio?: string;
  followers?: string;
  mutuals?: string;
  initials?: string;
  following?: boolean;
  image?: string;
  className?: string;
}

export const card22Demo: Card22Props = {
  name: "Jordan Reyes",
  handle: "jordan.builds",
  bio: "Shipping tiny tools for bigger teams. Runs, coffee, small synths.",
  followers: "12.4K followers",
  mutuals: "Andrea Kim + 8 mutuals",
  initials: "JR",
  following: false,
  image:
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop",
};

export function Card22({
  name,
  handle,
  bio,
  followers,
  mutuals,
  initials = "??",
  following = false,
  image,
  className,
}: Card22Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-sm font-bold text-white">
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
            {handle && (
              <span className="truncate text-sm text-muted-foreground">
                @{handle}
              </span>
            )}
          </div>
          <button
            type="button"
            className={cn(
              "shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors",
              following
                ? "border border-border bg-card text-card-foreground hover:bg-muted"
                : "bg-foreground text-background hover:opacity-90"
            )}
          >
            {following ? "Following" : "Follow"}
          </button>
        </div>
        {bio && (
          <p className="line-clamp-2 text-sm leading-snug text-card-foreground">
            {bio}
          </p>
        )}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {followers && <span>{followers}</span>}
          {mutuals && (
            <span className="inline-flex items-center gap-1">
              <Users className="size-3" aria-hidden="true" />
              {mutuals}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
