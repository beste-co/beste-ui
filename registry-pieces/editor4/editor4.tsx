"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type DiffKind = "add" | "remove" | "context";

interface DiffLine {
  kind: DiffKind;
  content: string;
  line?: number;
}

interface Editor4Props {
  filename?: string;
  lines?: DiffLine[];
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}


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

export const editor4Demo: Editor4Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  filename: "button.tsx",
  lines: [
    { kind: "context", line: 12, content: "export function Button({ label }) {" },
    { kind: "remove", line: 13, content: "  return <button>{label}</button>;" },
    { kind: "add", content: "  return <button className=\"btn\">{label}</button>;" },
    { kind: "context", line: 14, content: "}" },
  ],
};

const diffConfig: Record<
  DiffKind,
  { prefix: string; row: string; prefixColor: string }
> = {
  add: {
    prefix: "+",
    row: "bg-emerald-100/70 dark:bg-emerald-950/60",
    prefixColor: "text-emerald-600 dark:text-emerald-400",
  },
  remove: {
    prefix: "−",
    row: "bg-rose-100/70 dark:bg-rose-950/60",
    prefixColor: "text-rose-600 dark:text-rose-400",
  },
  context: {
    prefix: " ",
    row: "",
    prefixColor: "text-current/30",
  },
};

export function Editor4({
  filename,
  lines = [],
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Editor4Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col overflow-hidden rounded-md shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        {filename && (
          <div className="border-b border-current/15 px-3 py-1.5 font-mono text-xs text-current/60">
            {filename}
          </div>
        )}
        <pre className="overflow-auto py-1 font-mono text-xs leading-relaxed">
          {lines.map((l, i) => {
            const cfg = diffConfig[l.kind];
            return (
              <div
                key={i}
                className={cn("flex gap-3 px-3", cfg.row)}
              >
                <span
                  className="w-5 shrink-0 select-none text-right text-current/30"
                  aria-hidden="true"
                >
                  {l.line ? l.line : ""}
                </span>
                <span
                  className={cn(
                    "w-3 shrink-0 select-none font-bold",
                    cfg.prefixColor
                  )}
                  aria-hidden="true"
                >
                  {cfg.prefix}
                </span>
                <code className="flex-1">
                  {l.content}
                </code>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}
