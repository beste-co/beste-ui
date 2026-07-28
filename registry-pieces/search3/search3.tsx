"use client";

import { ArrowUpRight, FileText, Hash, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Result {
  icon: "page" | "user" | "channel";
  label: string;
  hint?: string;
}

interface Search3Props {
  query?: string;
  results?: Result[];
  footerHint?: string;
  className?: string;
}

const iconMap = {
  page: FileText,
  user: User,
  channel: Hash,
};

export const search3Demo: Search3Props = {
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
  className,
}: Search3Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xl">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
          <Search
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="flex-1 truncate text-sm text-card-foreground">
            {query}
          </span>
          <kbd className="inline-flex h-5 items-center rounded-md border border-border bg-muted px-1.5 font-mono text-xs text-muted-foreground">
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
                  idx === 0 && "bg-muted"
                )}
              >
                <Icon
                  className="size-3.5 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="flex-1 truncate text-card-foreground">
                  {item.label}
                </span>
                {item.hint && (
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {item.hint}
                  </span>
                )}
                {idx === 0 && (
                  <ArrowUpRight
                    className="size-3.5 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                )}
              </div>
            );
          })}
        </div>
        {footerHint && (
          <div className="flex items-center justify-between border-t border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
            <span>{footerHint}</span>
            <kbd className="inline-flex h-4 items-center rounded border border-border bg-card px-1 font-mono text-xs">
              ↵
            </kbd>
          </div>
        )}
      </div>
    </div>
  );
}
