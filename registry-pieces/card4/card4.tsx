"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Status = "online" | "away" | "offline";

interface Card4Props {
  avatarSrc?: string;
  avatarAlt?: string;
  fallback?: string;
  name?: string;
  role?: string;
  status?: Status;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const statusClasses: Record<Status, string> = {
  online: "bg-emerald-500",
  away: "bg-amber-500",
  offline: "bg-slate-400",
};


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

export const card4Demo: Card4Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  avatarSrc:
    "https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjI3fHxwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D",
  avatarAlt: "Merve Özkan",
  fallback: "MÖ",
  name: "Merve Özkan",
  role: "Product Designer",
  status: "online",
};

export function Card4({
  avatarSrc,
  avatarAlt,
  fallback = "??",
  name,
  role,
  status,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Card4Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-64 items-center gap-3 rounded-lg px-3 py-2.5 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="relative shrink-0">
          <Avatar className="size-10">
            <AvatarImage
              src={avatarSrc}
              alt={avatarAlt}
              className="object-cover"
            />
            <AvatarFallback className="text-sm font-semibold">
              {fallback}
            </AvatarFallback>
          </Avatar>
          {status && (
            <span
              className={cn(
                "absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-card",
                statusClasses[status]
              )}
              aria-hidden="true"
            />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-semibold">
            {name}
          </span>
          <span className="truncate text-xs text-current/60">
            {role}
          </span>
        </div>
      </div>
    </div>
  );
}
