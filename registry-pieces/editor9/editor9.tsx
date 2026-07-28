"use client";

import { Search } from "lucide-react";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

interface Command {
  label: string;
  hint?: string;
  shortcut?: string[];
}

interface Editor9Props {
  query?: string;
  commands?: Command[];
  className?: string;
}

export const editor9Demo: Editor9Props = {
  query: "format",
  commands: [
    { label: "Format Document", hint: "Editor", shortcut: ["⌥", "⇧", "F"] },
    { label: "Format Selection", hint: "Editor", shortcut: ["⌘", "K", "F"] },
    { label: "Reveal in File Explorer", hint: "File" },
  ],
};

export function Editor9({
  query = "",
  commands = [],
  className,
}: Editor9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col overflow-hidden rounded-lg border border-border bg-card shadow-md">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <Search
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="flex-1 truncate text-sm text-card-foreground">
            {query}
          </span>
          <span
            className="h-4 w-px animate-pulse bg-foreground"
            aria-hidden="true"
          />
        </div>
        <ul className="flex flex-col py-1">
          {commands.map((c, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-2 px-3 py-1.5 text-sm transition-colors hover:bg-muted"
            >
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-card-foreground">
                  {c.label}
                </span>
                {c.hint && (
                  <span className="text-xs text-muted-foreground">
                    {c.hint}
                  </span>
                )}
              </div>
              {c.shortcut && c.shortcut.length > 0 && (
                <div className="flex items-center gap-0.5" aria-hidden="true">
                  {c.shortcut.map((k, j) => (
                    <Fragment key={j}>
                      {j > 0 && (
                        <span className="text-xs text-muted-foreground/60">
                          +
                        </span>
                      )}
                      <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-border border-b-2 bg-muted px-1 font-mono text-xs font-medium text-muted-foreground">
                        {k}
                      </kbd>
                    </Fragment>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
