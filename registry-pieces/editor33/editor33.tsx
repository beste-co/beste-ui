"use client";

import { cn } from "@/lib/utils";

interface EmojiItem {
  shortcode: string;
  emoji: string;
  active?: boolean;
}

interface Editor33Props {
  query?: string;
  items?: EmojiItem[];
  className?: string;
}

export const editor33Demo: Editor33Props = {
  query: ":fi",
  items: [
    { shortcode: ":fire:", emoji: "🔥", active: true },
    { shortcode: ":finish_line:", emoji: "🏁" },
    { shortcode: ":first_place:", emoji: "🥇" },
    { shortcode: ":fish:", emoji: "🐟" },
  ],
};

export function Editor33({
  query = "",
  items = [],
  className,
}: Editor33Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-64 flex-col gap-1">
        <div className="flex items-center gap-0 rounded-md border border-border bg-card px-3 py-2 font-mono text-xs shadow-sm">
          <span className="text-card-foreground">{query}</span>
          <span
            className="h-3.5 w-px animate-pulse bg-foreground"
            aria-hidden="true"
          />
        </div>
        <ul className="flex flex-col overflow-hidden rounded-md border border-border bg-card shadow-md">
          {items.map((it, i) => (
            <li
              key={i}
              className={cn(
                "flex items-center gap-2 px-2 py-1 font-mono text-xs",
                it.active && "bg-muted"
              )}
            >
              <span
                className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-background text-base"
                aria-hidden="true"
              >
                {it.emoji}
              </span>
              <span className="truncate text-card-foreground">
                {it.shortcode}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
