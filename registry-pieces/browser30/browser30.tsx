"use client";

import { Check, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface Account {
  name: string;
  email: string;
  initials: string;
  active?: boolean;
}

interface Browser30Props {
  accounts?: Account[];
  manageLabel?: string;
  className?: string;
}

export const browser30Demo: Browser30Props = {
  accounts: [
    {
      name: "Mara Lindqvist",
      email: "mara@auralis.studio",
      initials: "ML",
      active: true,
    },
    { name: "Personal", email: "mara@gmail.com", initials: "MP" },
  ],
  manageLabel: "Manage profiles",
};

export function Browser30({
  accounts = [],
  manageLabel = "Manage profiles",
  className,
}: Browser30Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col rounded-lg border border-border bg-card p-1.5 shadow-md">
        {accounts.map((account, index) => (
          <button
            key={index}
            type="button"
            className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted"
          >
            <div
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground",
                account.active && "ring-2 ring-primary ring-offset-2 ring-offset-card"
              )}
            >
              {account.initials}
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium text-card-foreground">
                {account.name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {account.email}
              </span>
            </div>
            {account.active && (
              <Check
                className="size-4 shrink-0 text-primary"
                aria-hidden="true"
              />
            )}
          </button>
        ))}
        <div className="my-1 border-t border-border" />
        <button
          type="button"
          className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted"
        >
          <span className="flex size-8 shrink-0 items-center justify-center text-muted-foreground">
            <Settings className="size-4" aria-hidden="true" />
          </span>
          <span className="text-sm text-card-foreground">{manageLabel}</span>
        </button>
      </div>
    </div>
  );
}
