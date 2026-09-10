"use client";

import { Phone, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Member {
  src?: string;
  alt?: string;
  fallback: string;
}

interface Chat3Props {
  title?: string;
  members?: Member[];
  count?: number;
  membersLabel?: string;
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

export const chat3Demo: Chat3Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  title: "Design Team",
  count: 12,
  membersLabel: "members",
  members: [
    {
      src: "https://images.unsplash.com/photo-1600603405959-6d623e92445c?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D",
      alt: "Ayşe",
      fallback: "AK",
    },
    {
      src: "https://images.unsplash.com/photo-1728516687021-905c3feb5046?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D",
      alt: "Merve",
      fallback: "MÖ",
    },
    {
      src: "https://images.unsplash.com/photo-1731341711390-a721b4e31b6a?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDd8fHxlbnwwfHx8fHw%3D",
      alt: "Sarah",
      fallback: "SB",
    },
  ],
};

export function Chat3({
  title = "Chat",
  members = [],
  count,
  membersLabel = "members",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Chat3Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className={cn("flex w-full max-w-80 items-center gap-3 rounded-lg px-3 py-2.5 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center -space-x-2">
          {members.slice(0, 3).map((m, i) => (
            <Avatar key={i} className="size-8 border-2 border-card">
              <AvatarImage src={m.src} alt={m.alt} className="object-cover" />
              <AvatarFallback className="text-xs font-semibold">{m.fallback}</AvatarFallback>
            </Avatar>
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-semibold">{title}</span>
          {typeof count === "number" && (
            <span className="text-xs text-current/60">
              {count} {membersLabel}
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            aria-label="Voice call"
            className="flex size-8 items-center justify-center rounded-full text-current/60 transition-colors hover:bg-current/10 hover:text-current"
          >
            <Phone className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Video call"
            className="flex size-8 items-center justify-center rounded-full text-current/60 transition-colors hover:bg-current/10 hover:text-current"
          >
            <Video className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
