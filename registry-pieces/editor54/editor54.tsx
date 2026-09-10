"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface MetaField {
  label: string;
  value: string;
}

interface Editor54Props {
  title?: string;
  status?: string;
  fields?: MetaField[];
  tags?: string[];
  stepMs?: number;
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

export const editor54Demo: Editor54Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  title: "Post Settings",
  status: "Draft",
  fields: [
    { label: "Author", value: "Nina Simone" },
    { label: "Publish Date", value: "12 May 2026" },
    { label: "Read Time", value: "5 min read" },
  ],
  tags: ["retail", "case study"],
  stepMs: 380,
};

/* Only the values and the tags arrive. Labels hold the rows open from the
   first frame so the drawer keeps one height. */
const STYLES = `
@keyframes editor54-in { from { opacity: 0; transform: translateX(0.375rem); } to { opacity: 1; transform: none; } }
.editor54-in { animation: editor54-in 300ms ease-out both; }
@media (prefers-reduced-motion: reduce) { .editor54-in { animation: none; } }
`;

export function Editor54({
  title,
  status,
  fields = [],
  tags = [],
  stepMs = 380,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Editor54Props) {
  const total = fields.length + 1;
  const [filled, setFilled] = useState(0);

  useEffect(() => {
    if (filled >= total) return;
    const id = setTimeout(() => setFilled((value) => value + 1), stepMs);
    return () => clearTimeout(id);
  }, [filled, total, stepMs]);

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
        <div className="flex items-center justify-between gap-3">
          {title && (
            <h3 className="truncate text-sm font-semibold">
              {title}
            </h3>
          )}
          {status && (
            <span className="shrink-0 rounded-full bg-current/10 px-2 py-0.5 text-xs font-medium opacity-60">
              {status}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          {fields.map((field, index) => (
            <div
              key={field.label}
              className="flex items-center justify-between gap-3 py-0.5"
            >
              <span className="shrink-0 text-xs opacity-60">
                {field.label}
              </span>
              <span
                className={cn(
                  "truncate text-xs",
                  index < filled ? "editor54-in" : "invisible"
                )}
              >
                {field.value}
              </span>
            </div>
          ))}
        </div>

        {tags.length > 0 && (
          <div
            className={cn(
              "flex flex-wrap gap-1.5",
              filled > fields.length ? "editor54-in" : "invisible"
            )}
          >
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-current/10 px-2 py-0.5 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
