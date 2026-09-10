"use client";

import { Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Socialproof3Props {
  quote?: string;
  authorName?: string;
  authorRole?: string;
  avatarSrc?: string;
  avatarAlt?: string;
  fallback?: string;
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

export const socialproof3Demo: Socialproof3Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  quote:
    "Shipped our marketing site in a weekend. The blocks feel designed, not generated.",
  authorName: "Deniz Arslan",
  authorRole: "Co-founder, Sable",
  avatarSrc:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
  avatarAlt: "Deniz Arslan",
  fallback: "DA",
};

export function Socialproof3({
  quote,
  authorName,
  authorRole,
  avatarSrc,
  avatarAlt,
  fallback = "??",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Socialproof3Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("relative flex w-full max-w-80 flex-col gap-3 rounded-xl p-4 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <Quote
          className="absolute right-3 top-3 size-6 text-current/20"
          aria-hidden="true"
        />
        {quote && (
          <p className="pr-6 text-sm leading-relaxed">
            {quote}
          </p>
        )}
        <div className="flex items-center gap-2.5 border-t border-current/15 pt-3">
          <Avatar className="size-8">
            <AvatarImage
              src={avatarSrc}
              alt={avatarAlt}
              className="object-cover"
            />
            <AvatarFallback className="text-xs font-semibold">
              {fallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold">
              {authorName}
            </span>
            <span className="truncate text-xs text-current/60">
              {authorRole}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
