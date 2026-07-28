"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";

type Role = "received" | "sent";

interface Chat1Props {
  avatarSrc?: string;
  avatarAlt?: string;
  fallback?: string;
  message?: string;
  timestamp?: string;
  role?: Role;
  className?: string;
}

export const chat1Demo: Chat1Props = {
  avatarSrc:
    "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjI0fHxwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D",
  avatarAlt: "Ayşe Kaya",
  fallback: "AK",
  message: "Hey, did you get a chance to look at the new onboarding flow?",
  timestamp: "09:42",
  role: "received",
};

export function Chat1({
  avatarSrc,
  avatarAlt,
  fallback = "??",
  message,
  timestamp,
  role = "received",
  className,
}: Chat1Props) {
  const isSent = role === "sent";

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex max-w-72 items-end gap-2",
          isSent && "flex-row-reverse"
        )}
      >
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
        <div className="flex flex-col gap-0.5">
          <div
            className={cn(
              "rounded-2xl px-3 py-2 text-sm leading-snug shadow-sm",
              isSent
                ? "rounded-br-md bg-primary text-primary-foreground"
                : "rounded-bl-md bg-muted text-card-foreground"
            )}
          >
            {message}
          </div>
          {timestamp && (
            <span
              className={cn(
                "px-1 text-xs text-muted-foreground",
                isSent && "text-right"
              )}
            >
              {timestamp}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
