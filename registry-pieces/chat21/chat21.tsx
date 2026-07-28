"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Chat21Props {
  emojis?: string[];
  className?: string;
}

export const chat21Demo: Chat21Props = {
  emojis: ["👍", "❤️", "😂", "🎉", "🔥", "😮"],
};

export function Chat21({
  emojis = ["👍", "❤️", "😂"],
  className,
}: Chat21Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-0.5 rounded-full border border-border bg-card p-1 shadow-md">
        {emojis.slice(0, 6).map((e, i) => (
          <button
            key={i}
            type="button"
            className="flex size-8 items-center justify-center rounded-full text-lg transition-colors hover:bg-muted"
            aria-label={`React with ${e}`}
          >
            <span aria-hidden="true">{e}</span>
          </button>
        ))}
        <div className="mx-0.5 h-5 w-px bg-border" aria-hidden="true" />
        <button
          type="button"
          aria-label="More reactions"
          className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
