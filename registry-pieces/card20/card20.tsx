"use client";

import { Twitter } from "lucide-react";
import { cn } from "@/lib/utils";

interface Card20Props {
  name?: string;
  role?: string;
  location?: string;
  bio?: string;
  initials?: string;
  handle?: string;
  image?: string;
  bordered?: boolean;
  className?: string;
}

export const card20Demo: Card20Props = {
  name: "Nils Frahm",
  role: "Design lead",
  bio: "Designing the tooling that ships millions of components every week.",
  initials: "NF",
  image:
    "https://images.unsplash.com/photo-1529068755536-a5ade0dcb4e8?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjgwfHxwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D",
  bordered: false,
};

export function Card20({
  name,
  role,
  location,
  bio,
  initials = "??",
  handle,
  image,
  bordered = false,
  className,
}: Card20Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-3 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
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
              <span className="truncate text-xs text-muted-foreground">
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
