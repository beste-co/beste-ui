"use client";

import { KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";

interface Browser29Props {
  domain?: string;
  username?: string;
  saveLabel?: string;
  dismissLabel?: string;
  className?: string;
}

export const browser29Demo: Browser29Props = {
  domain: "stripe.com",
  username: "mara@auralis.studio",
  saveLabel: "Save",
  dismissLabel: "Never",
};

export function Browser29({
  domain = "example.com",
  username = "you@example.com",
  saveLabel = "Save",
  dismissLabel = "Never",
  className,
}: Browser29Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <KeyRound className="size-3.5" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="text-sm font-semibold text-card-foreground">
              Save password?
            </span>
            <span className="truncate font-mono text-xs text-muted-foreground">
              {domain}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 rounded-md border border-border bg-background px-2.5 py-2">
          <span className="truncate text-sm text-card-foreground">
            {username}
          </span>
          <span className="text-sm tracking-widest text-muted-foreground">
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
