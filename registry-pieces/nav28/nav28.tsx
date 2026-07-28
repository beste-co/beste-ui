"use client";

import { Menu, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Nav28Props {
  brand?: string;
  avatarSrc?: string;
  avatarAlt?: string;
  initials?: string;
  className?: string;
}

const defaultAvatar = "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=70&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D";

export const nav28Demo: Nav28Props = {
  brand: "Beste",
  avatarSrc: defaultAvatar,
  avatarAlt: "Account",
  initials: "BS",
};

export function Nav28({
  brand = "Beste",
  avatarSrc = defaultAvatar,
  avatarAlt,
  initials = "BS",
  className,
}: Nav28Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center justify-between rounded-full border border-border bg-card px-3 py-2 shadow-sm">
        <button
          type="button"
          className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
          aria-label="Menu"
        >
          <Menu className="size-4" aria-hidden="true" />
        </button>
        <span className="text-sm font-bold text-card-foreground">
          {brand}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
            aria-label="Search"
          >
            <Search className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="relative flex size-7 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-semibold text-white"
            aria-label="Account"
          >
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={avatarAlt ?? "Account"}
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              initials
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
