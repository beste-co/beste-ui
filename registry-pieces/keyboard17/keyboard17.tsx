"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Shortcut {
  keys: string[];
  label: string;
}

interface Keyboard17Props {
  shortcuts?: Shortcut[];
  pressMs?: number;
  holdMs?: number;
  className?: string;
}

export const keyboard17Demo: Keyboard17Props = {
  shortcuts: [
    { keys: ["⌘", "K"], label: "Open command palette" },
    { keys: ["⌘", "⇧", "P"], label: "Run a command" },
    { keys: ["⌘", "/"], label: "Show all shortcuts" },
  ],
};

export function Keyboard17({
  shortcuts = [],
  pressMs = 280,
  holdMs = 1600,
  className,
}: Keyboard17Props) {
  const [index, setIndex] = useState(0);
  const [pressed, setPressed] = useState(0);

  const current = shortcuts[index % Math.max(1, shortcuts.length)];
  const total = current?.keys.length ?? 0;
  const released = pressed < 0;
  const complete = total > 0 && pressed >= total;

  useEffect(() => {
    if (!shortcuts.length) return;
    let id: ReturnType<typeof setTimeout>;
    if (released) {
      id = setTimeout(() => {
        setIndex((i) => (i + 1) % shortcuts.length);
        setPressed(0);
      }, 600);
    } else if (complete) {
      id = setTimeout(() => setPressed(-1), holdMs);
    } else {
      id = setTimeout(() => setPressed((p) => p + 1), pressMs);
    }
    return () => clearTimeout(id);
  }, [released, complete, pressed, shortcuts.length, pressMs, holdMs]);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col items-center gap-3">
        <div className="flex h-10 items-center justify-center gap-1.5" aria-hidden="true">
          {current?.keys.map((k, i) => {
            const down = !released && i < pressed;
            return (
              <kbd
                key={`${index}-${i}`}
                className={cn(
                  "flex size-10 items-center justify-center rounded-lg border border-border font-mono text-sm transition-all duration-150 ease-out motion-reduce:transition-none",
                  down
                    ? "translate-y-0.5 border-b bg-muted text-card-foreground shadow-none"
                    : "border-b-2 bg-gradient-to-b from-card to-muted text-card-foreground shadow-sm"
                )}
              >
                {k}
              </kbd>
            );
          })}
        </div>

        <div className="flex min-h-5 items-center">
          <p
            className={cn(
              "text-center text-sm font-medium leading-snug transition-colors duration-300 ease-out motion-reduce:transition-none",
              complete ? "text-card-foreground" : "text-muted-foreground"
            )}
          >
            <span className="sr-only">
              {current ? `${current.keys.join(" plus ")}: ` : ""}
            </span>
            {current?.label}
          </p>
        </div>
      </div>
    </div>
  );
}
