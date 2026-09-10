"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Access = "read" | "write" | "withheld";

interface ToolRow {
  name: string;
  access: Access;
}

interface Code17Props {
  title?: string;
  countLabel?: string;
  tools?: ToolRow[];
  readLabel?: string;
  writeLabel?: string;
  withheldLabel?: string;
  stepMs?: number;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

/* Amber carries the one annotation that means a change is made. It lightens on an
   inverted card, where the surface behind it is the foreground colour. */
const accessClasses = (inverted: boolean): Record<Access, string> => ({
  read: "opacity-60",
  write: inverted ? "text-amber-400" : "text-amber-600 dark:text-amber-400",
  withheld: "opacity-60",
});


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

export const code17Demo: Code17Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  title: "Tools",
  countLabel: "62 available",
  tools: [
    { name: "list_pages", access: "read" },
    { name: "update_section", access: "write" },
    { name: "create_page", access: "write" },
    { name: "publish", access: "withheld" },
  ],
  readLabel: "reads",
  writeLabel: "writes draft",
  withheldLabel: "not exposed",
  stepMs: 460,
};

/* Tool names hold the rows open; only the annotation arrives, and the strike
   through the withheld one is a text decoration, so nothing shifts. */
const STYLES = `
@keyframes code17-in { from { opacity: 0; transform: translateX(0.375rem); } to { opacity: 1; transform: none; } }
.code17-in { animation: code17-in 280ms ease-out both; }
@media (prefers-reduced-motion: reduce) { .code17-in { animation: none; } }
`;

export function Code17({
  title,
  countLabel,
  tools = [],
  readLabel = "reads",
  writeLabel = "writes draft",
  withheldLabel = "not exposed",
  stepMs = 460,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Code17Props) {
  const [annotated, setAnnotated] = useState(0);

  useEffect(() => {
    if (annotated >= tools.length) return;
    const id = setTimeout(() => setAnnotated((value) => value + 1), stepMs);
    return () => clearTimeout(id);
  }, [annotated, tools.length, stepMs]);

  const hint: Record<Access, string> = {
    read: readLabel,
    write: writeLabel,
    withheld: withheldLabel,
  };

  const tone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{STYLES}</style>

      <div
        className={cn(
          "flex w-full max-w-72 flex-col gap-3 rounded-xl p-4 shadow-sm",
          tone,
          bordered && "border border-current/15"
        )}
      >
        <div className="flex items-baseline justify-between gap-3">
          {title && (
            <h3 className="text-sm font-semibold">
              {title}
            </h3>
          )}
          {countLabel && (
            <span className="shrink-0 text-xs opacity-60">
              {countLabel}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          {tools.map((tool, index) => {
            const done = index < annotated;

            return (
              <div
                key={tool.name}
                className="flex items-center justify-between gap-3 py-0.5"
              >
                <code
                  className={cn(
                    "truncate font-mono text-xs transition-colors duration-300 motion-reduce:transition-none",
                    tool.access === "withheld" && done && "opacity-60 line-through"
                  )}
                >
                  {tool.name}
                </code>
                <span
                  className={cn(
                    "shrink-0 text-xs",
                    accessClasses(inverted)[tool.access],
                    done ? "code17-in" : "invisible"
                  )}
                >
                  {hint[tool.access]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
