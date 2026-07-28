"use client";

import { cn } from "@/lib/utils";

interface Suggestion {
  label: string;
  active?: boolean;
}

interface Editor39Props {
  prefix?: string;
  typo?: string;
  suffix?: string;
  suggestions?: Suggestion[];
  className?: string;
}

export const editor39Demo: Editor39Props = {
  prefix: "The ",
  typo: "implmentation",
  suffix: " ships on Friday.",
  suggestions: [
    { label: "implementation", active: true },
    { label: "implements" },
    { label: "implemented" },
  ],
};

export function Editor39({
  prefix = "",
  typo = "",
  suffix = "",
  suggestions = [],
  className,
}: Editor39Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1.5">
        <div className="rounded-md border border-border bg-card px-3 py-2 text-sm leading-snug shadow-sm">
          <span className="text-card-foreground">{prefix}</span>
          <span className="text-card-foreground underline decoration-rose-500 decoration-wavy underline-offset-4">
            {typo}
          </span>
          <span className="text-card-foreground">{suffix}</span>
        </div>
        <ul className="flex flex-col overflow-hidden rounded-md border border-border bg-card shadow-md">
          {suggestions.map((s, i) => (
            <li
              key={i}
              className={cn(
                "px-3 py-1.5 text-xs",
                s.active && "bg-muted"
              )}
            >
              <span
                className={cn(
                  s.active
                    ? "font-semibold text-card-foreground"
                    : "text-muted-foreground"
                )}
              >
                {s.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
