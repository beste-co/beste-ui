"use client";
import { cn } from "@/lib/utils";

interface Notification8Props {
  name?: string;
  username?: string;
  initials?: string;
  mutualCount?: number;
  image?: string;
  className?: string;
}

export const notification8Demo: Notification8Props = {
  name: "Jordan Reyes",
  username: "jordan.r",
  initials: "JR",
  mutualCount: 12,
  image:
    "https://images.unsplash.com/photo-1667063160344-58a0f325715a?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDM1fHx8ZW58MHx8fHx8",
};

export function Notification8({
  name,
  username,
  initials = "??",
  mutualCount,
  image,
  className,
}: Notification8Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-semibold text-white">
            {image ? (
              <img
                src={image}
                alt={name ?? ""}
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {name && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {name}
              </span>
            )}
            {username && (
              <span className="truncate text-xs text-muted-foreground">
                @{username}
              </span>
            )}
            {typeof mutualCount === "number" && mutualCount > 0 && (
              <span className="mt-0.5 text-xs text-muted-foreground">
                {mutualCount} mutual connections
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex-1 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Accept
          </button>
          <button
            type="button"
            className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-semibold text-card-foreground hover:bg-muted"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
