"use client";

import { CornerDownRight, Heart, Reply } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification14Props {
  author?: string;
  initials?: string;
  comment?: string;
  context?: string;
  likes?: number;
  time?: string;
  image?: string;
  className?: string;
}

export const notification14Demo: Notification14Props = {
  author: "Priya Shah",
  initials: "PS",
  comment:
    "Love the new onboarding flow! Quick q — does the skip button persist across sessions?",
  context: "replied to your comment",
  likes: 4,
  time: "8m",
  image:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop",
};

export function Notification14({
  author,
  initials = "??",
  comment,
  context = "replied to your comment",
  likes,
  time,
  image,
  className,
}: Notification14Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-lg border border-border bg-card p-3 shadow-lg">
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
          <div className="ml-3 flex gap-2 border-l-2 border-border pl-2">
            <CornerDownRight
              className="mt-0.5 size-3 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="text-sm leading-snug text-card-foreground">
              {comment}
            </span>
          </div>
        )}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <button
            type="button"
            className="inline-flex items-center gap-1 hover:text-card-foreground"
          >
            <Heart className="size-3" aria-hidden="true" />
            {typeof likes === "number" ? likes : "Like"}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 hover:text-card-foreground"
          >
            <Reply className="size-3" aria-hidden="true" />
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}
