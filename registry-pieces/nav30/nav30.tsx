"use client";

import { cn } from "@/lib/utils";

interface Command {
  key: string;
  hint: string;
}

interface Nav30Props {
  heading?: string;
  commands?: Command[];
  bordered?: boolean;
  className?: string;
}

export const nav30Demo: Nav30Props = {
  commands: [
    { key: "/new", hint: "Start a new doc" },
    { key: "/todo", hint: "Insert a checklist" },
    { key: "/team", hint: "Mention a teammate" },
    { key: "/embed", hint: "Embed a link or file" },
  ],
  bordered: false,
};

export function Nav30({
  heading,
  commands = [],
  bordered = false,
  className,
}: Nav30Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-1 rounded-lg bg-card p-2 shadow-lg", bordered && "border border-border")}>
        {heading && (
          <span className="px-2 pb-1 pt-1 text-xs font-semibold text-muted-foreground">
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
              <span className="text-xs font-semibold text-card-foreground">
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
