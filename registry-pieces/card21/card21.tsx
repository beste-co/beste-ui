"use client";

import { MessageCircle, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface Card21Props {
  name?: string;
  title?: string;
  department?: string;
  initials?: string;
  online?: boolean;
  image?: string;
  className?: string;
}

export const card21Demo: Card21Props = {
  name: "Andrea Kim",
  title: "Staff engineer",
  department: "Platform · Beste",
  initials: "AK",
  online: true,
  image:
    "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjg0fHxwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D",
};

export function Card21({
  name,
  title,
  department,
  initials = "??",
  online = false,
  image,
  className,
}: Card21Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="relative shrink-0">
          <div className="relative flex size-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-xs font-bold text-white">
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
          {online && (
            <span
              className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-card bg-emerald-500"
              aria-hidden="true"
            />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          {name && (
            <span className="truncate text-sm font-semibold text-card-foreground">
              {name}
            </span>
          )}
          {title && (
            <span className="truncate text-sm text-card-foreground">
              {title}
            </span>
          )}
          {department && (
            <span className="truncate text-xs text-muted-foreground">
              {department}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-md bg-muted text-card-foreground hover:bg-muted-foreground/10"
            aria-label="Message"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
            aria-label="More"
          >
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
