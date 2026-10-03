"use client";

import { AtSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification5Props {
  username?: string;
  channel?: string;
  quote?: string;
  time?: string;
  bordered?: boolean;
  className?: string;
}

export const notification5Demo: Notification5Props = {
  username: "maya.dev",
  channel: "#design-review",
  quote: "Can you take a look at the new pricing layout when you're free?",
  bordered: false,
};

export function Notification5({
  username,
  channel,
  quote,
  time,
  bordered = false,
  className,
}: Notification5Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 items-start gap-3 rounded-lg bg-card p-3 shadow-lg", bordered && "border border-border")}>
        <AtSign
          className="mt-0.5 size-5 shrink-0 text-sky-600 dark:text-sky-400"
          aria-hidden="true"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-sm text-card-foreground">
            <span className="font-semibold">@{username}</span>
            <span className="text-muted-foreground"> mentioned you in </span>
            <span className="font-medium">{channel}</span>
          </span>
          {quote && (
            <span className="rounded-md bg-muted px-2 py-1 text-sm italic text-muted-foreground">
              {quote}
            </span>
          )}
          {time && (
            <span className="text-xs text-muted-foreground">{time}</span>
          )}
        </div>
      </div>
    </div>
  );
}
