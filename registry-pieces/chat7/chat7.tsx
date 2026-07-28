"use client";

import { CornerDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "received" | "sent";

interface Chat7Props {
  replyAuthor?: string;
  replyPreview?: string;
  message?: string;
  role?: Role;
  className?: string;
}

export const chat7Demo: Chat7Props = {
  replyAuthor: "Ayşe",
  replyPreview: "What time are we demoing tomorrow?",
  message: "10 AM Istanbul, same Zoom link as last week.",
  role: "sent",
};

export function Chat7({
  replyAuthor = "Someone",
  replyPreview,
  message,
  role = "received",
  className,
}: Chat7Props) {
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
          "flex max-w-72 flex-col gap-1",
          isSent ? "ml-auto items-end" : "mr-auto items-start"
        )}
      >
        <div className="flex items-center gap-1.5 px-1 text-xs text-muted-foreground">
          <CornerDownRight className="size-3" aria-hidden="true" />
          <span>
            Replying to{" "}
            <span className="font-semibold text-card-foreground">
              {replyAuthor}
            </span>
          </span>
        </div>
        {replyPreview && (
          <div
            className={cn(
              "max-w-full truncate rounded-xl px-3 py-1 text-xs text-muted-foreground",
              isSent ? "bg-muted/70" : "bg-muted"
            )}
          >
            {replyPreview}
          </div>
        )}
        {message && (
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
        )}
      </div>
    </div>
  );
}
