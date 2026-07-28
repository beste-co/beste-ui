"use client";

import { Slash } from "lucide-react";
import { cn } from "@/lib/utils";

interface Command {
  key: string;
  hint: string;
}

interface Nav30Props {
  heading?: string;
  commands?: Command[];
  className?: string;
}

export const nav30Demo: Nav30Props = {
  heading: "Quick commands",
  commands: [
    { key: "/new", hint: "Start a new doc" },
    { key: "/todo", hint: "Insert a checklist" },
    { key: "/team", hint: "Mention a teammate" },
    { key: "/embed", hint: "Embed a link or file" },
  ],
};

export function Nav30({
  heading,
  commands = [],
  className,
}: Nav30Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1 rounded-lg border border-border bg-card p-2 shadow-lg">
        {heading && (
          <span className="px-2 pb-1 pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {heading}
          </span>
        )}
        <div className="flex flex-col">
          {commands.map((c, idx) => (
            <button
              key={idx}
              type="button"
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-muted"
            >
              <Slash
                className="size-3 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="font-mono text-xs font-semibold text-card-foreground">
                {c.key}
              </span>
              <span className="flex-1 truncate text-xs text-muted-foreground">
                {c.hint}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
