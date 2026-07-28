"use client";

import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Nav20Props {
  name?: string;
  email?: string;
  initials?: string;
  imageSrc?: string;
  alt?: string;
  className?: string;
}

const defaultImage = "https://images.unsplash.com/photo-1749989402507-1d8a8e98bb14?w=70&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHdoaXRlJTIwcHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D";

export const nav20Demo: Nav20Props = {
  name: "Beste Sözen",
  email: "mira@beste.co",
  initials: "BS",
  imageSrc: defaultImage,
  alt: "Beste Sözen",
};

export function Nav20({
  name,
  email,
  initials = "??",
  imageSrc = defaultImage,
  alt,
  className,
}: Nav20Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-52 flex-col gap-0.5 rounded-lg border border-border bg-card p-2 shadow-lg">
        <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
          <div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-bold text-white">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={alt ?? name ?? ""}
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold text-card-foreground">
              {name}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {email}
            </span>
          </div>
        </div>
        <span
          className="mx-1 h-px bg-border"
          aria-hidden="true"
        />
        <button
          type="button"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-card-foreground hover:bg-muted"
        >
          <User className="size-3.5" aria-hidden="true" />
          Profile
        </button>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-card-foreground hover:bg-muted"
        >
          <Settings className="size-3.5" aria-hidden="true" />
          Settings
          <span className="ml-auto font-mono text-xs text-muted-foreground">
            ⌘,
          </span>
        </button>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-card-foreground hover:bg-muted"
        >
          <ChevronDown className="size-3.5" aria-hidden="true" />
          Switch workspace
        </button>
        <span
          className="mx-1 h-px bg-border"
          aria-hidden="true"
        />
        <button
          type="button"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-rose-600 hover:bg-rose-500/10 dark:text-rose-400"
        >
          <LogOut className="size-3.5" aria-hidden="true" />
          Sign out
        </button>
      </div>
    </div>
  );
}
