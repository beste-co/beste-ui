"use client";

import { cn } from "@/lib/utils";

interface Modifier {
  symbol: string;
  name: string;
}

interface Keyboard8Props {
  modifiers?: Modifier[];
  heading?: string;
  className?: string;
}

export const keyboard8Demo: Keyboard8Props = {
  heading: "Modifier keys",
  modifiers: [
    { symbol: "⌘", name: "Command" },
    { symbol: "⌥", name: "Option" },
    { symbol: "⇧", name: "Shift" },
    { symbol: "⌃", name: "Control" },
  ],
};

export function Keyboard8({
  heading,
  modifiers = [],
  className,
}: Keyboard8Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex flex-col items-center gap-3">
        {heading && (
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {heading}
          </span>
        )}
        <div className="flex items-center gap-2">
          {modifiers.map((mod, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <kbd className="flex size-10 items-center justify-center rounded-lg border border-border border-b-2 bg-gradient-to-b from-card to-muted font-mono text-lg font-semibold text-card-foreground shadow-sm">
                {mod.symbol}
              </kbd>
              <span className="text-xs text-muted-foreground">{mod.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
