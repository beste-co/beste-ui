"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Reaction {
  emoji: string;
  count: number;
}

interface Chat36Props {
  name?: string;
  initials?: string;
  message?: string;
  reactions?: Reaction[];
  tickMs?: number;
  holdMs?: number;
  className?: string;
}

export const chat36Demo: Chat36Props = {
  name: "Prince",
  initials: "PR",
  message: "Album art is final. Dropping the single Friday at midnight.",
  reactions: [
    { emoji: "🔥", count: 4 },
    { emoji: "💜", count: 3 },
    { emoji: "🎉", count: 2 },
  ],
};

export function Chat36({
  name = "Contact",
  initials = "??",
  message = "",
  reactions = [],
  tickMs = 450,
  holdMs = 2600,
  className,
}: Chat36Props) {
  const [tick, setTick] = useState(0);
  const total = reactions.reduce((sum, r) => sum + r.count, 0);

  useEffect(() => {
    if (!total) return;
    const id = setTimeout(
      () => setTick((t) => (t >= total ? 0 : t + 1)),
      tick >= total ? holdMs : tickMs
    );
    return () => clearTimeout(id);
  }, [tick, total, tickMs, holdMs]);

  let remaining = tick;
  const counts = reactions.map((r) => {
    const c = Math.min(r.count, Math.max(0, remaining));
    remaining -= r.count;
    return c;
  });

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes chat36-pop { 0% { opacity: 0; transform: scale(0.4); } 60% { opacity: 1; transform: scale(1.15); } 100% { opacity: 1; transform: scale(1); } } @keyframes chat36-count { from { opacity: 0; transform: translateY(0.25rem); } to { opacity: 1; transform: none; } }`}</style>
      <div className="flex w-full max-w-72 items-start gap-2">
        <span
          className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-card-foreground"
          aria-hidden="true"
        >
          {initials}
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <span className="px-1 text-xs text-muted-foreground">{name}</span>
          <p className="rounded-2xl rounded-bl-md bg-muted px-3 py-2 text-sm leading-snug text-card-foreground shadow-sm">
            {message}
          </p>
          <div className="flex h-7 items-center gap-1.5 px-1">
            {reactions.map((r, i) =>
              counts[i] > 0 ? (
                <span
                  key={r.emoji}
                  className="inline-flex h-6 items-center gap-1 rounded-full border border-border bg-card px-2 text-xs shadow-sm"
                  style={{ animation: "chat36-pop 400ms ease-out" }}
                >
                  <span aria-hidden="true">{r.emoji}</span>
                  <span
                    key={counts[i]}
                    className="inline-block font-medium tabular-nums text-card-foreground"
                    style={{ animation: "chat36-count 250ms ease-out" }}
                  >
                    {counts[i]}
                  </span>
                </span>
              ) : null
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
