"use client";

import { cn } from "@/lib/utils";

interface BlameLine {
  line: number;
  author: string;
  time?: string;
  hash?: string;
  code: string;
}

interface Editor20Props {
  lines?: BlameLine[];
  bordered?: boolean;
  className?: string;
}

export const editor20Demo: Editor20Props = {
  lines: [
    {
      line: 40,
      author: "Hania",
      code: "const greet = (name: string) =>",
    },
    {
      line: 41,
      author: "Nils",
      code: "  `Hello, ${name}!`;",
    },
    {
      line: 42,
      author: "Hania",
      code: "",
    },
  ],
  bordered: false,
};

export function Editor20({ lines = [], bordered = false, className }: Editor20Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <pre className={cn("flex w-full max-w-80 flex-col overflow-hidden rounded-md bg-card py-1 text-xs leading-relaxed shadow-sm", bordered && "border border-border")}>
        {lines.map((l, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-3 py-0.5"
          >
            <span
              className="w-5 shrink-0 select-none text-right text-muted-foreground/60"
              aria-hidden="true"
            >
              {l.line}
            </span>
            <code className="w-40 shrink-0 truncate text-card-foreground">
              {l.code || "\u00A0"}
            </code>
            <span className="ml-auto flex shrink-0 items-center gap-1 text-muted-foreground">
              <span className="text-card-foreground">{l.author}</span>
              {l.time && (
                <>
                  <span>·</span>
                  <span>{l.time}</span>
                </>
              )}
              {l.hash && (
                <>
                  <span>·</span>
                  <span className="rounded-sm bg-muted px-1 tabular-nums">
                    {l.hash.slice(0, 7)}
                  </span>
                </>
              )}
            </span>
          </div>
        ))}
      </pre>
    </div>
  );
}
