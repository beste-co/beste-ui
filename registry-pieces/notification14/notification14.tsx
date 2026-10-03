"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification14Props {
  author?: string;
  initials?: string;
  comment?: string;
  context?: string;
  likes?: number;
  time?: string;
  image?: string;
  bordered?: boolean;
  className?: string;
}

export const notification14Demo: Notification14Props = {
  author: "Agnes Obel",
  initials: "AO",
  comment:
    "Love the new onboarding flow. Does the skip button persist across sessions?",
  context: "replied to your comment",
  image:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop",
  bordered: false,
};

export function Notification14({
  author,
  initials = "??",
  comment,
  context = "replied to your comment",
  likes,
  time,
  image,
  bordered = false,
  className,
}: Notification14Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-lg bg-card p-3 shadow-lg", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <div className="relative flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-xs font-semibold text-white">
            {image ? (
              <img
                src={image}
                alt={author ?? ""}
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="flex min-w-0 flex-1 items-baseline gap-1.5 text-xs">
            {author && (
              <span className="truncate font-semibold text-card-foreground">
                {author}
              </span>
            )}
            <span className="truncate text-muted-foreground">{context}</span>
          </div>
          {time && (
            <span className="shrink-0 text-xs text-muted-foreground">
              {time}
            </span>
          )}
        </div>
        {comment && (
          <span className="ml-3 border-l-2 border-border pl-2 text-sm leading-snug text-card-foreground">
            {comment}
          </span>
        )}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <button
            type="button"
            className="inline-flex items-center gap-1 hover:text-card-foreground"
          >
            {typeof likes === "number" ? (
              <>
                <Heart className="size-3" aria-hidden="true" />
                <span className="tabular-nums">{likes}</span>
              </>
            ) : (
              "Like"
            )}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 hover:text-card-foreground"
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}
