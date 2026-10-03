"use client";

import { ChevronDown, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Browser33Props {
  title?: string;
  name?: string;
  folder?: string;
  removeLabel?: string;
  doneLabel?: string;
  bordered?: boolean;
  className?: string;
}

export const browser33Demo: Browser33Props = {
  title: "Bookmark added",
  name: "Auralis Design Studio",
  folder: "Bookmarks bar",
  removeLabel: "Remove",
  doneLabel: "Done",
  bordered: false,
};

export function Browser33({
  title = "Bookmark added",
  name = "Untitled",
  folder = "Bookmarks bar",
  removeLabel = "Remove",
  doneLabel = "Done",
  bordered = false,
  className,
}: Browser33Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 flex-col gap-3 rounded-lg bg-card p-3 shadow-md", bordered && "border border-border")}>
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
          <div className={cn("rounded-md px-2.5 py-1.5", bordered ? "border border-border bg-background" : "bg-muted")}>
            <span className="block truncate text-sm text-card-foreground">
              {name}
            </span>
          </div>
          <button
            type="button"
            className={cn("flex cursor-pointer items-center justify-between gap-2 rounded-md px-2.5 py-1.5 transition-colors hover:bg-muted", bordered ? "border border-border bg-background" : "bg-muted hover:bg-muted-foreground/15")}
          >
            <span className="truncate text-sm text-card-foreground">
              {folder}
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
