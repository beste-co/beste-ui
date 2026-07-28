"use client";

import { cn } from "@/lib/utils";

type Role = "received" | "sent";

interface Chat24Props {
  message?: string;
  role?: Role;
  editedAt?: string;
  className?: string;
}

export const chat24Demo: Chat24Props = {
  message: "Let's shift the sync to 3pm instead.",
  role: "received",
  editedAt: "09:48",
};

export function Chat24({
  message,
  role = "received",
  editedAt,
  className,
}: Chat24Props) {
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
          "flex max-w-64 flex-col gap-1",
          isSent ? "ml-auto items-end" : "mr-auto items-start"
        )}
      >
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
        <span className="px-1 text-xs italic text-muted-foreground">
          edited{editedAt && ` · ${editedAt}`}
        </span>
      </div>
    </div>
  );
}
