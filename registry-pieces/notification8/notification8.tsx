"use client";
import { cn } from "@/lib/utils";

interface Notification8Props {
  name?: string;
  username?: string;
  initials?: string;
  mutualCount?: number;
  image?: string;
  bordered?: boolean;
  className?: string;
}

export const notification8Demo: Notification8Props = {
  name: "Ólafur Arnalds",
  username: "olafur",
  initials: "ÓA",
  image:
    "https://images.unsplash.com/photo-1667063160344-58a0f325715a?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDM1fHx8ZW58MHx8fHx8",
  bordered: false,
};

export function Notification8({
  name,
  username,
  initials = "??",
  mutualCount,
  image,
  bordered = false,
  className,
}: Notification8Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-3 rounded-lg bg-card p-3 shadow-lg", bordered && "border border-border")}>
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
            className={cn("flex-1 rounded-md px-3 py-1.5 text-sm font-semibold text-card-foreground hover:bg-muted", bordered ? "border border-border bg-background" : "bg-muted hover:bg-muted-foreground/15")}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
