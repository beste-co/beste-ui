"use client";

import { Heart, MessageCircle, Repeat2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

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
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const socialproof27Demo: Socialproof27Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Socialproof27Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className={cn("w-full max-w-80 rounded-md p-5 shadow-xl", surfaceTone, bordered && "border border-current/15")}>
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
              <p className="truncate text-sm font-semibold">{name}</p>
            )}
            {handle && <p className="truncate text-sm text-current/60">{handle}</p>}
          </div>
          {time && <span className="shrink-0 text-sm text-current/60">{time}</span>}
        </div>

        {body && (
          <p className="mt-3 text-sm leading-relaxed">{body}</p>
        )}

        <div className="mt-4 flex items-center gap-5 border-t border-current/15 pt-3">
          {replies && (
            <span className="flex items-center gap-1.5 text-sm text-current/60">
              <MessageCircle className="size-3.5" aria-hidden="true" />
              {replies}
            </span>
          )}
          {reposts && (
            <span className="flex items-center gap-1.5 text-sm text-current/60">
              <Repeat2 className="size-3.5" aria-hidden="true" />
              {reposts}
            </span>
          )}
          {likes && (
            <span className="flex items-center gap-1.5 text-sm text-current/60">
              <Heart className="size-3.5" aria-hidden="true" />
              {likes}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
