"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Code16Props {
  command?: string;
  files?: string[];
  note?: string;
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

export const code16Demo: Code16Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  command: "npx shadcn@latest add https://ui.beste.co/r/hero181.json",
  files: ["components/hero181.tsx", "components/ui/button.tsx"],
  note: "MIT licensed, no account needed",
  stepMs: 520,
};

/* The command is never typed out: wrapping it letter by letter would change how
   many lines it takes and move everything under it. The ticks arrive instead. */
const STYLES = `
@keyframes code16-tick { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: none; } }
.code16-tick { animation: code16-tick 260ms ease-out both; }
@media (prefers-reduced-motion: reduce) { .code16-tick { animation: none; } }
`;

export function Code16({
  command,
  files = [],
  note,
  stepMs = 520,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Code16Props) {
  const [written, setWritten] = useState(0);

  useEffect(() => {
    if (written >= files.length) return;
    const id = setTimeout(() => setWritten((value) => value + 1), stepMs);
    return () => clearTimeout(id);
  }, [written, files.length, stepMs]);

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

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
          surfaceTone,
          bordered && "border border-current/15"
        )}
      >
        {command && (
          <div className="flex items-start gap-2 rounded-md bg-current/10 p-2.5">
            <span
              className="shrink-0 font-mono text-xs text-current/60"
              aria-hidden="true"
            >
              $
            </span>
            <code className="min-w-0 flex-1 break-all font-mono text-xs leading-relaxed">
              {command}
            </code>
            <Copy
              className="size-3 shrink-0 text-current/60"
              aria-hidden="true"
            />
          </div>
        )}

        <div className="flex flex-col gap-1">
          {files.map((file, index) => {
            const done = index < written;

            return (
              <div key={file} className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex size-3.5 shrink-0 items-center justify-center",
                    done ? "code16-tick" : "invisible"
                  )}
                  aria-hidden="true"
                >
                  <Check
                    className={cn(
                      "size-3.5",
                      inverted ? "text-emerald-400" : "text-emerald-600 dark:text-emerald-400"
                    )}
                  />
                </span>
                <span
                  className={cn(
                    "truncate font-mono text-xs transition-colors duration-300 motion-reduce:transition-none",
                    done ? "" : "text-current/60"
                  )}
                >
                  {file}
                </span>
              </div>
            );
          })}
        </div>

        {note && <p className="text-xs text-current/60">{note}</p>}
      </div>
    </div>
  );
}
