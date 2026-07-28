"use client";

import { Paperclip, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification11Props {
  sender?: string;
  email?: string;
  subject?: string;
  preview?: string;
  time?: string;
  hasAttachment?: boolean;
  starred?: boolean;
  className?: string;
}

export const notification11Demo: Notification11Props = {
  sender: "Stripe",
  email: "receipts@stripe.com",
  subject: "Your February invoice is ready",
  preview:
    "Your usage for February 1 – 29 totalled $1,284.00. Payment will be collected on the 3rd.",
  time: "09:42",
  hasAttachment: true,
  starred: false,
};

export function Notification11({
  sender,
  email,
  subject,
  preview,
  time,
  hasAttachment = false,
  starred = false,
  className,
}: Notification11Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1.5 rounded-lg border border-border bg-card p-3 shadow-lg">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {sender && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {sender}
              </span>
            )}
            {email && (
              <span className="truncate text-xs text-muted-foreground">
                {email}
              </span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {hasAttachment && (
              <Paperclip
                className="size-3.5 text-muted-foreground"
                aria-hidden="true"
              />
            )}
            <Star
              className={cn(
                "size-3.5",
                starred
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground"
              )}
              aria-hidden="true"
            />
            {time && (
              <span className="text-xs text-muted-foreground">{time}</span>
            )}
          </div>
        </div>
        {subject && (
          <span className="truncate text-sm font-medium text-card-foreground">
            {subject}
          </span>
        )}
        {preview && (
          <span className="line-clamp-2 text-xs leading-snug text-muted-foreground">
            {preview}
          </span>
        )}
      </div>
    </div>
  );
}
