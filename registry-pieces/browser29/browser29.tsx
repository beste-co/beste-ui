"use client";

import { KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";

interface Browser29Props {
  domain?: string;
  username?: string;
  saveLabel?: string;
  dismissLabel?: string;
  bordered?: boolean;
  className?: string;
}

export const browser29Demo: Browser29Props = {
  domain: "stripe.com",
  username: "hello@beste.co",
  saveLabel: "Save",
  dismissLabel: "Never",
  bordered: false,
};

export function Browser29({
  domain = "example.com",
  username = "you@example.com",
  saveLabel = "Save",
  dismissLabel = "Never",
  bordered = false,
  className,
}: Browser29Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 flex-col gap-3 rounded-lg bg-card p-3 shadow-md", bordered && "border border-border")}>
        <div className="flex items-center gap-2.5">
          <KeyRound
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <div className="flex min-w-0 flex-col">
            <span className="text-sm font-semibold text-card-foreground">
              Save password?
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {domain}
            </span>
          </div>
        </div>
        <div className={cn("flex flex-col gap-1.5 rounded-md px-2.5 py-2", bordered ? "border border-border bg-background" : "bg-muted")}>
          <span className="truncate text-sm text-card-foreground">
            {username}
          </span>
          <span className="text-sm text-muted-foreground">
            ••••••••••
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex-1 cursor-pointer rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {saveLabel}
          </button>
          <button
            type="button"
            className="flex-1 cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            {dismissLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
