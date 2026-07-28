"use client";

import {
  Bookmark,
  Paintbrush,
  Puzzle,
  Shield,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Browser12Props {
  className?: string;
}

const extensions = [
  { Icon: Shield, tint: "text-emerald-500", label: "Privacy" },
  { Icon: Paintbrush, tint: "text-sky-500", label: "Theme" },
  { Icon: Bookmark, tint: "text-amber-500", label: "Bookmarks" },
  { Icon: Wand2, tint: "text-violet-500", label: "AI Helper" },
];

export const browser12Demo: Browser12Props = {};

export function Browser12({ className }: Browser12Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-0.5 rounded-md border border-border bg-card p-1 shadow-sm">
        {extensions.map(({ Icon, tint, label }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            className="flex size-7 items-center justify-center rounded-sm transition-colors hover:bg-muted"
          >
            <Icon className={cn("size-4", tint)} aria-hidden="true" />
          </button>
        ))}
        <div className="mx-0.5 h-5 w-px bg-border" aria-hidden="true" />
        <button
          type="button"
          aria-label="Manage extensions"
          className="flex size-7 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
        >
          <Puzzle className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
