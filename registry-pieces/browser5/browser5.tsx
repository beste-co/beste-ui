"use client";

import { Folder, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Bookmark {
  label: string;
  folder?: boolean;
}

interface Browser5Props {
  bookmarks?: Bookmark[];
  className?: string;
}

export const browser5Demo: Browser5Props = {
  bookmarks: [
    { label: "Work", folder: true },
    { label: "GitHub" },
    { label: "Linear" },
    { label: "Figma" },
    { label: "Reading" },
  ],
};

export function Browser5({ bookmarks = [], className }: Browser5Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-1 overflow-hidden rounded-md border border-border bg-card px-2 py-1 shadow-sm">
        {bookmarks.map((b, i) => {
          const Icon = b.folder ? Folder : Star;
          return (
            <div
              key={i}
              className="flex shrink-0 items-center gap-1 rounded px-1.5 py-1 text-xs text-card-foreground transition-colors hover:bg-muted"
            >
              <Icon
                className={cn(
                  "size-3",
                  b.folder
                    ? "text-amber-500 fill-amber-400"
                    : "text-muted-foreground"
                )}
                aria-hidden="true"
              />
              <span className="truncate font-medium">{b.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
