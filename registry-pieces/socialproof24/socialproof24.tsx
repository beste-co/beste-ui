"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Member {
  src: string;
  alt: string;
  name?: string;
}

interface Socialproof24Props {
  items?: Member[];
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

export const socialproof24Demo: Socialproof24Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  items: [
    {
      src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop",
      alt: "Portrait of a product designer",
    },
    {
      src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop",
      alt: "Portrait of a frontend engineer",
    },
    {
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop",
      alt: "Portrait of a content strategist",
      name: "Dana Whitlock",
    },
    {
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&h=160&fit=crop",
      alt: "Portrait of a product manager",
    },
  ],
};

export function Socialproof24({ items = [], surface = "card", bordered = true, inverted = false, className }: Socialproof24Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex items-center -space-x-4">
        {items.map((member, index) => (
          <div key={index} className="relative">
            {member.name && (
              <div className="absolute -top-9 left-1/2 z-10 -translate-x-1/2">
                <div className={cn("whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium shadow-md", surfaceTone, bordered && "border border-current/15")}>
                  {member.name}
                </div>
                <span
                  className={cn("absolute left-1/2 top-full size-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b border-r border-current/15 ", surfaceTone)}
                  aria-hidden="true"
                />
              </div>
            )}
            <Avatar className="size-14 border-2 border-background shadow-sm">
              <AvatarImage
                src={member.src}
                alt={member.alt}
                className="object-cover"
              />
              <AvatarFallback>
                {member.alt
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>
        ))}
      </div>
    </div>
  );
}
