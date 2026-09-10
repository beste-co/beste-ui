"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Line {
  tokens: { text: string; kind?: "keyword" | "string" | "comment" | "fn" | "var" }[];
}

interface Editor1Props {
  filename?: string;
  lines?: Line[];
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

export const editor1Demo: Editor1Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  filename: "greet.ts",
  lines: [
    {
      tokens: [
        { text: "export", kind: "keyword" },
        { text: " " },
        { text: "function", kind: "keyword" },
        { text: " " },
        { text: "greet", kind: "fn" },
        { text: "(name: string) {" },
      ],
    },
    {
      tokens: [
        { text: "  " },
        { text: "return", kind: "keyword" },
        { text: " " },
        { text: "`Hello, ${name}!`", kind: "string" },
        { text: ";" },
      ],
    },
    { tokens: [{ text: "}" }] },
    { tokens: [] },
    {
      tokens: [
        { text: "// Ship it", kind: "comment" },
      ],
    },
  ],
};

const tokenClass: Record<
  NonNullable<Line["tokens"][number]["kind"]>,
  string
> = {
  keyword: "text-violet-600 dark:text-violet-400",
  string: "text-emerald-600 dark:text-emerald-400",
  comment: "italic text-current/60",
  fn: "text-sky-600 dark:text-sky-400",
  var: "text-amber-600 dark:text-amber-400",
};

export function Editor1({
  filename = "file.ts",
  lines = [],
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Editor1Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col overflow-hidden rounded-lg shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center justify-between border-b border-current/15 px-3 py-1.5">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-rose-500" />
            <span className="size-2.5 rounded-full bg-amber-500" />
            <span className="size-2.5 rounded-full bg-emerald-500" />
          </div>
          <span className="font-mono text-xs text-current/60">
            {filename}
          </span>
          <span className="size-4" aria-hidden="true" />
        </div>
        <pre className="overflow-auto px-3 py-2 font-mono text-xs leading-relaxed">
          {lines.map((line, i) => (
            <div key={i} className="flex gap-3">
              <span
                className="w-4 shrink-0 select-none text-right text-current/35"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <code className="flex-1">
                {line.tokens.length === 0 ? (
                  <span>&nbsp;</span>
                ) : (
                  line.tokens.map((t, j) => (
                    <span
                      key={j}
                      className={t.kind ? tokenClass[t.kind] : undefined}
                    >
                      {t.text}
                    </span>
                  ))
                )}
              </code>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
