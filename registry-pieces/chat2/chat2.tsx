"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Chat2Props {
  avatarSrc?: string;
  avatarAlt?: string;
  fallback?: string;
  className?: string;
}

export const chat2Demo: Chat2Props = {
  avatarSrc:
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
  avatarAlt: "Sarah Brown",
  fallback: "SB",
};

export function Chat2({
  avatarSrc,
  avatarAlt,
  fallback = "??",
  className,
}: Chat2Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex items-end gap-2">
        <Avatar className="size-7">
          <AvatarImage
            src={avatarSrc}
            alt={avatarAlt}
            className="object-cover"
          />
          <AvatarFallback className="text-xs font-semibold">
            {fallback}
          </AvatarFallback>
        </Avatar>
        <div
          className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-muted px-3 py-3 shadow-sm"
          aria-label="Typing"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-1.5 rounded-full bg-muted-foreground animate-pulse"
              style={{
                animationDelay: `${i * 180}ms`,
                animationDuration: "1s",
              }}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
