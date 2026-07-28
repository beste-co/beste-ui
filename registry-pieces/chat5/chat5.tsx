"use client";

import { cn } from "@/lib/utils";

interface Reaction {
  emoji: string;
  count: number;
  mine?: boolean;
}

type Role = "received" | "sent";

interface Chat5Props {
  message?: string;
  reactions?: Reaction[];
  role?: Role;
  className?: string;
}

export const chat5Demo: Chat5Props = {
  message: "Shipped the v2 onboarding this morning 🚀",
  reactions: [
    { emoji: "🔥", count: 4, mine: true },
    { emoji: "🎉", count: 2 },
    { emoji: "❤️", count: 1 },
  ],
  role: "received",
};

export function Chat5({
  message,
  reactions = [],
  role = "received",
  className,
}: Chat5Props) {
  const isSent = role === "sent";

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex max-w-64 flex-col gap-2",
          isSent ? "ml-auto items-end" : "mr-auto items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-3 py-2 text-sm leading-snug shadow-sm",
            isSent
              ? "rounded-br-md bg-primary text-primary-foreground"
              : "rounded-bl-md bg-muted text-card-foreground"
          )}
        >
          {message}
        </div>
        {reactions.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 px-1">
            {reactions.map((r, i) => (
              <span
                key={i}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-xs shadow-sm transition-colors",
                  r.mine
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-card-foreground"
                )}
              >
                <span className="text-sm leading-none" aria-hidden="true">
                  {r.emoji}
                </span>
                <span className="font-semibold tabular-nums">{r.count}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
