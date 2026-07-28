"use client";

import { ChevronDown, Folder, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Browser33Props {
  title?: string;
  name?: string;
  folder?: string;
  removeLabel?: string;
  doneLabel?: string;
  className?: string;
}

export const browser33Demo: Browser33Props = {
  title: "Bookmark added",
  name: "Auralis — Independent Design Studio",
  folder: "Bookmarks bar",
  removeLabel: "Remove",
  doneLabel: "Done",
};

export function Browser33({
  title = "Bookmark added",
  name = "Untitled",
  folder = "Bookmarks bar",
  removeLabel = "Remove",
  doneLabel = "Done",
  className,
}: Browser33Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-md">
        <div className="flex items-center gap-2">
          <Star
            className="size-4 shrink-0 fill-amber-400 text-amber-400"
            aria-hidden="true"
          />
          <span className="text-sm font-semibold text-card-foreground">
            {title}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="rounded-md border border-border bg-background px-2.5 py-1.5">
            <span className="block truncate text-sm text-card-foreground">
              {name}
            </span>
          </div>
          <button
            type="button"
            className="flex cursor-pointer items-center justify-between gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 transition-colors hover:bg-muted"
          >
            <span className="flex min-w-0 items-center gap-2 text-sm text-card-foreground">
              <Folder
                className="size-3.5 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="truncate">{folder}</span>
            </span>
            <ChevronDown
              className="size-3.5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
          </button>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            {removeLabel}
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {doneLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
