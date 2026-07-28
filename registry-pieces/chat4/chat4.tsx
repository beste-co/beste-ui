"use client";

import { cn } from "@/lib/utils";

type Role = "received" | "sent";

interface PollOption {
  label: string;
  votes: number;
}

interface Chat4Props {
  question?: string;
  options?: PollOption[];
  role?: Role;
  votesLabel?: string;
  className?: string;
}

export const chat4Demo: Chat4Props = {
  question: "Where are we grabbing lunch?",
  options: [
    { label: "Packer's Coffee", votes: 6 },
    { label: "Sushi place", votes: 3 },
    { label: "Stay in, order pizza", votes: 9 },
  ],
  role: "received",
  votesLabel: "votes",
};

export function Chat4({
  question,
  options = [],
  role = "received",
  votesLabel = "votes",
  className,
}: Chat4Props) {
  const isSent = role === "sent";
  const total = options.reduce((sum, o) => sum + o.votes, 0) || 1;
  const max = Math.max(...options.map((o) => o.votes), 1);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex w-64 flex-col gap-2 rounded-2xl px-3 py-2.5 shadow-sm",
          isSent
            ? "ml-auto rounded-br-md bg-primary text-primary-foreground"
            : "mr-auto rounded-bl-md bg-muted text-card-foreground"
        )}
      >
        {question && (
          <span className="text-sm font-semibold leading-snug">
            {question}
          </span>
        )}
        <ul className="flex flex-col gap-1.5">
          {options.map((opt, i) => {
            const pct = (opt.votes / max) * 100;
            return (
              <li
                key={i}
                className={cn(
                  "relative flex items-center justify-between overflow-hidden rounded-md px-2 py-1 text-xs",
                  isSent
                    ? "bg-primary-foreground/10"
                    : "bg-card"
                )}
              >
                <span
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-md transition-all",
                    isSent ? "bg-primary-foreground/20" : "bg-primary/15"
                  )}
                  style={{ width: `${pct}%` }}
                  aria-hidden="true"
                />
                <span className="relative truncate font-medium">
                  {opt.label}
                </span>
                <span className="relative shrink-0 font-mono tabular-nums">
                  {opt.votes}
                </span>
              </li>
            );
          })}
        </ul>
        <span
          className={cn(
            "text-xs",
            isSent ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        >
          {total} {votesLabel}
        </span>
      </div>
    </div>
  );
}
