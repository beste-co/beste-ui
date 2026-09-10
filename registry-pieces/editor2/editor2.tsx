"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type ItemKind = "function" | "variable" | "class" | "interface" | "keyword";

interface Completion {
  label: string;
  kind: ItemKind;
  detail?: string;
  active?: boolean;
}

interface Editor2Props {
  prefix?: string;
  items?: Completion[];
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const kindConfig: Record<ItemKind, { letter: string; color: string }> = {
  function: {
    letter: "ƒ",
    color: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  },
  variable: {
    letter: "v",
    color: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  },
  class: {
    letter: "C",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  interface: {
    letter: "I",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  keyword: {
    letter: "k",
    color: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  },
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

export const editor2Demo: Editor2Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  prefix: "user.",
  items: [
    { label: "id", kind: "variable", detail: "string" },
    { label: "name", kind: "variable", detail: "string", active: true },
    { label: "email", kind: "variable", detail: "string" },
    { label: "isAdmin", kind: "variable", detail: "boolean" },
    { label: "save", kind: "function", detail: "(): Promise<void>" },
  ],
};

export function Editor2({
  prefix = "",
  items = [],
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Editor2Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1">
        <div className={cn("flex items-center gap-0 rounded-md px-3 py-2 font-mono text-xs shadow-sm", surfaceTone, bordered && "border border-current/15")}>
          <span className="">{prefix}</span>
          <span
            className="h-3.5 w-px animate-pulse bg-current"
            aria-hidden="true"
          />
        </div>
        <ul className="flex flex-col overflow-hidden rounded-md border border-current/15 bg-current/10 shadow-md">
          {items.map((it, i) => {
            const cfg = kindConfig[it.kind];
            return (
              <li
                key={i}
                className={cn(
                  "flex items-center gap-2 px-2 py-1 font-mono text-xs",
                  it.active && "bg-current/10"
                )}
              >
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-sm font-sans font-bold",
                    cfg.color
                  )}
                  aria-hidden="true"
                >
                  {cfg.letter}
                </span>
                <span
                  className={cn(
                    "truncate",
                    it.active
                      ? "font-semibold"
                      : ""
                  )}
                >
                  {it.label}
                </span>
                {it.detail && (
                  <span className="ml-auto truncate text-current/60">
                    {it.detail}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
