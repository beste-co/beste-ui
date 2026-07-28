"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";

type Presence = "online" | "away" | "busy" | "offline";

interface Chat16Props {
  src?: string;
  alt?: string;
  fallback?: string;
  name?: string;
  lastSeen?: string;
  presence?: Presence;
  className?: string;
}

const presenceClasses: Record<Presence, { dot: string; label: string }> = {
  online: { dot: "bg-emerald-500", label: "Online" },
  away: { dot: "bg-amber-500", label: "Away" },
  busy: { dot: "bg-rose-500", label: "Do not disturb" },
  offline: { dot: "bg-slate-400", label: "Offline" },
};

export const chat16Demo: Chat16Props = {
  src: "https://images.unsplash.com/photo-1583264277168-58ceba4b84e7?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE1fHx8ZW58MHx8fHx8",
  alt: "John Doe",
  fallback: "JD",
  name: "John Doe",
  presence: "online",
  lastSeen: "Active now",
};

export function Chat16({
  src,
  alt,
  fallback = "??",
  name,
  lastSeen,
  presence = "offline",
  className,
}: Chat16Props) {
  const cfg = presenceClasses[presence];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-64 items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
        <div className="relative shrink-0">
          <Avatar className="size-11">
            <AvatarImage src={src} alt={alt} className="object-cover" />
            <AvatarFallback className="text-sm font-semibold">
              {fallback}
            </AvatarFallback>
          </Avatar>
          <span
            className={cn(
              "absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-card",
              cfg.dot
            )}
            aria-hidden="true"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-semibold text-card-foreground">
            {name}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {lastSeen ?? cfg.label}
          </span>
        </div>
      </div>
    </div>
  );
}
