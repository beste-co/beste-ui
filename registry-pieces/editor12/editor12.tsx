"use client";

import { cn } from "@/lib/utils";

type OutlineKind = "class" | "function" | "method" | "prop";

interface OutlineItem {
  label: string;
  kind: OutlineKind;
  depth?: number;
  active?: boolean;
}

interface Editor12Props {
  items?: OutlineItem[];
  className?: string;
}

const kindConfig: Record<
  OutlineKind,
  { letter: string; color: string }
> = {
  class: {
    letter: "C",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  function: {
    letter: "ƒ",
    color:
      "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  },
  method: {
    letter: "m",
    color: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  },
  prop: {
    letter: "p",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
};

export const editor12Demo: Editor12Props = {
  items: [
    { label: "Dashboard", kind: "class", depth: 0 },
    { label: "constructor", kind: "method", depth: 1 },
    { label: "state", kind: "prop", depth: 1 },
    { label: "render", kind: "method", depth: 1, active: true },
    { label: "computeStats", kind: "function", depth: 0 },
  ],
};

export function Editor12({ items = [], className }: Editor12Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-60 flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm">
        <div className="border-b border-border px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Outline
        </div>
        <ul className="flex flex-col py-1">
          {items.map((item, i) => {
            const cfg = kindConfig[item.kind];
            return (
              <li
                key={i}
                className={cn(
                  "flex items-center gap-2 px-2 py-1 font-mono text-xs",
                  item.active && "bg-muted"
                )}
                style={{ paddingLeft: `${0.5 + (item.depth ?? 0) * 1}rem` }}
              >
                <span
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded-sm font-sans font-bold",
                    cfg.color
                  )}
                  aria-hidden="true"
                >
                  {cfg.letter}
                </span>
                <span
                  className={cn(
                    "truncate",
                    item.active
                      ? "font-semibold text-card-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
