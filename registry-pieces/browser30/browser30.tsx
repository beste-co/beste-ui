"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Account {
  name: string;
  email: string;
  initials: string;
  /** Portrait; an empty string falls back to the initials. */
  avatar?: string;
  active?: boolean;
}

const defaultAvatar =
  "https://images.unsplash.com/photo-1578412004177-21321e29f735?q=80&w=400&h=400&auto=format&fit=crop";

interface Browser30Props {
  accounts?: Account[];
  manageLabel?: string;
  bordered?: boolean;
  className?: string;
}

export const browser30Demo: Browser30Props = {
  accounts: [
    {
      name: "Hania Rani",
      email: "hello@beste.co",
      initials: "HR",
      avatar:
        "https://images.unsplash.com/photo-1621983266286-09645be8fd01?q=80&w=400&h=400&auto=format&fit=crop",
      active: true,
    },
    {
      name: "Nils Frahm",
      email: "hello@beste.co",
      initials: "NF",
      avatar:
        "https://images.unsplash.com/photo-1656337789708-cdf37b07112d?q=80&w=400&h=400&auto=format&fit=crop",
    },
  ],
  bordered: false,
};

export function Browser30({
  accounts = [],
  manageLabel,
  bordered = false,
  className,
}: Browser30Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 flex-col rounded-lg bg-card p-1.5 shadow-md", bordered && "border border-border")}>
        {accounts.map((account, index) => {
          const avatar = account.avatar ?? defaultAvatar;
          return (
            <button
              key={index}
              type="button"
              className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted"
            >
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-semibold text-muted-foreground",
                  account.active && "ring-2 ring-primary ring-offset-2 ring-offset-card"
                )}
              >
                {avatar ? (
                  <img src={avatar} alt="" className="size-full object-cover" />
                ) : (
                  account.initials
                )}
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
          );
        })}
        {manageLabel && (
          <>
            <div className="my-1 border-t border-border" />
            <button
              type="button"
              className="cursor-pointer rounded-md px-2 py-1.5 text-left text-sm text-card-foreground transition-colors hover:bg-muted"
            >
              {manageLabel}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
