"use client";

import { cn } from "@/lib/utils";

interface Keyboard12Props {
  entered?: number;
  total?: number;
  caption?: string;
  className?: string;
}

const layout: (string | null)[] = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  null,
  "0",
  null,
];

export const keyboard12Demo: Keyboard12Props = {
  entered: 4,
  total: 6,
  caption: "Enter your 6-digit PIN",
};

export function Keyboard12({
  entered = 0,
  total = 6,
  caption,
  className,
}: Keyboard12Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex flex-col items-center gap-3">
        {caption && (
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {caption}
          </span>
        )}
        <div className="flex items-center gap-1" aria-hidden="true">
          {Array.from({ length: total }).map((_, idx) => (
            <span
              key={idx}
              className={cn(
                "size-2 rounded-full",
                idx < entered ? "bg-foreground" : "bg-muted"
              )}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {layout.map((label, idx) =>
            label === null ? (
              <span key={idx} aria-hidden="true" />
            ) : (
              <kbd
                key={idx}
                className="flex size-10 items-center justify-center rounded-lg border border-border border-b-2 bg-gradient-to-b from-card to-muted font-mono text-lg font-semibold text-card-foreground shadow-sm"
              >
                {label}
              </kbd>
            )
          )}
        </div>
      </div>
    </div>
  );
}
