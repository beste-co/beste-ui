"use client";

import { Heart, MessageCircle, Repeat2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Avatar {
  src: string;
  alt: string;
}

interface Socialproof27Props {
  avatar?: Avatar;
  name?: string;
  handle?: string;
  body?: string;
  time?: string;
  replies?: string;
  reposts?: string;
  likes?: string;
  className?: string;
}

export const socialproof27Demo: Socialproof27Props = {
  avatar: {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop",
    alt: "Portrait of Tom Ashby",
  },
  name: "Tom Ashby",
  handle: "@tomashby",
  body: "Four clinics, one waiting list, and the first Monday in years where nobody rang round to fill a cancellation.",
  time: "2h",
  replies: "12",
  reposts: "34",
  likes: "218",
};

export function Socialproof27({
  avatar,
  name,
  handle,
  body,
  time,
  replies,
  reposts,
  likes,
  className,
}: Socialproof27Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="w-full max-w-80 rounded-md border border-border bg-card p-5 shadow-xl">
        <div className="flex items-center gap-3">
          {avatar && (
            <img
              className="size-10 shrink-0 rounded-full object-cover"
              src={avatar.src}
              alt={avatar.alt}
            />
          )}
          <div className="min-w-0 flex-1">
            {name && (
              <p className="truncate text-sm font-semibold text-card-foreground">{name}</p>
            )}
            {handle && <p className="truncate text-sm text-muted-foreground">{handle}</p>}
          </div>
          {time && <span className="shrink-0 text-sm text-muted-foreground">{time}</span>}
        </div>

        {body && (
          <p className="mt-3 text-sm leading-relaxed text-card-foreground">{body}</p>
        )}

        <div className="mt-4 flex items-center gap-5 border-t border-border pt-3">
          {replies && (
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MessageCircle className="size-3.5" aria-hidden="true" />
              {replies}
            </span>
          )}
          {reposts && (
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Repeat2 className="size-3.5" aria-hidden="true" />
              {reposts}
            </span>
          )}
          {likes && (
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Heart className="size-3.5" aria-hidden="true" />
              {likes}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
