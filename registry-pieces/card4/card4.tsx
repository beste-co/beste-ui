"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";

type Status = "online" | "away" | "offline";

interface Card4Props {
  avatarSrc?: string;
  avatarAlt?: string;
  fallback?: string;
  name?: string;
  role?: string;
  status?: Status;
  className?: string;
}

const statusClasses: Record<Status, string> = {
  online: "bg-emerald-500",
  away: "bg-amber-500",
  offline: "bg-slate-400",
};

export const card4Demo: Card4Props = {
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
  className,
}: Card4Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-64 items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
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
          <span className="truncate text-sm font-semibold text-card-foreground">
            {name}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {role}
          </span>
        </div>
      </div>
    </div>
  );
}
