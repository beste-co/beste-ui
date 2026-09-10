"use client";

import { ArrowUpRight, FileText, Hash, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Result {
  icon: "page" | "user" | "channel";
  label: string;
  hint?: string;
}

interface Search3Props {
  query?: string;
  results?: Result[];
  footerHint?: string;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const iconMap = {
  page: FileText,
  user: User,
  channel: Hash,
};


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const search3Demo: Search3Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  query: "launch",
  results: [
    { icon: "page", label: "Launch plan Q2", hint: "Docs" },
    { icon: "channel", label: "launch-prep", hint: "Channel" },
    { icon: "user", label: "Laura Ng", hint: "Launch lead" },
  ],
  footerHint: "↑↓ to navigate",
};

export function Search3({
  query = "",
  results = [],
  footerHint,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Search3Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full max-w-80 flex-col overflow-hidden rounded-xl shadow-xl",
          surfaceTone,
          bordered && "border border-current/15"
        )}
      >
        <div className="flex items-center gap-2 border-b border-current/15 px-3 py-2.5">
          <Search
            className="size-4 shrink-0 text-current/60"
            aria-hidden="true"
          />
          <span className="flex-1 truncate text-sm">
            {query}
          </span>
          <kbd className="inline-flex h-5 items-center rounded-md border border-current/15 bg-current/10 px-1.5 font-mono text-xs text-current/60">
            esc
          </kbd>
        </div>
        <div className="flex flex-col p-1">
          {results.map((item, idx) => {
            const Icon = iconMap[item.icon];
            return (
              <div
                key={idx}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm",
                  idx === 0 && "bg-current/10"
                )}
              >
                <Icon
                  className="size-3.5 shrink-0 text-current/60"
                  aria-hidden="true"
                />
                <span className="flex-1 truncate">
                  {item.label}
                </span>
                {item.hint && (
                  <span className="shrink-0 text-xs text-current/60">
                    {item.hint}
                  </span>
                )}
                {idx === 0 && (
                  <ArrowUpRight
                    className="size-3.5 shrink-0 text-current/60"
                    aria-hidden="true"
                  />
                )}
              </div>
            );
          })}
        </div>
        {footerHint && (
          <div className="flex items-center justify-between border-t border-current/15 bg-current/5 px-3 py-1.5 text-xs text-current/60">
            <span>{footerHint}</span>
            <kbd className="inline-flex h-4 items-center rounded border border-current/15 bg-current/10 px-1 font-mono text-xs">
              ↵
            </kbd>
          </div>
        )}
      </div>
    </div>
  );
}
