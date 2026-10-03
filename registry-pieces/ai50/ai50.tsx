"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Ai50Props {
  prompt?: string;
  reply?: string;
  model?: string;
  tokenMs?: number;
  holdMs?: number;
  bordered?: boolean;
  className?: string;
}

export const ai50Demo: Ai50Props = {
  prompt: "Name three quick wins for our onboarding.",
  reply:
    "Shorten the signup form to email only and show a sample project on first login.",
  bordered: false,
};

export function Ai50({
  prompt = "Ask anything",
  reply = "",
  model,
  tokenMs = 110,
  holdMs = 2800,
  bordered = false,
  className,
}: Ai50Props) {
  const tokens = reply.split(" ").filter(Boolean);
  const [count, setCount] = useState(0);
  const done = count >= tokens.length;

  useEffect(() => {
    if (!tokens.length) return;
    const id = setTimeout(
      () => setCount((c) => (c >= tokens.length ? 0 : c + 1)),
      done ? holdMs : tokenMs
    );
    return () => clearTimeout(id);
  }, [count, done, tokens.length, tokenMs, holdMs]);

  const rate = Math.round(1000 / tokenMs + Math.sin(count * 0.8) * 1.5);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes ai50-in { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: none; } }`}</style>
      <div className={cn("flex w-full max-w-80 flex-col gap-3 rounded-2xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex justify-end">
          <p className="max-w-64 rounded-2xl rounded-br-sm bg-muted px-3 py-1.5 text-sm leading-snug text-card-foreground">
            {prompt}
          </p>
        </div>

        <div className="flex items-start gap-2">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <p className="flex min-w-0 flex-1 flex-wrap gap-1">
            {tokens.map((t, i) => (
              <span
                key={i}
                className={cn(
                  "inline-block rounded-md bg-muted px-1.5 py-0.5 text-sm leading-snug text-card-foreground",
                  i >= count && "invisible"
                )}
                style={i < count ? { animation: "ai50-in 220ms ease-out" } : undefined}
              >
                {t}
              </span>
            ))}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {model && (
            <span className={cn("rounded-full px-2 py-0.5", bordered ? "border border-border" : "bg-muted")}>
              {model}
            </span>
          )}
          <span className="ml-auto inline-flex items-center gap-3 tabular-nums">
            <span>{count} tokens</span>
            <span>{done ? 0 : rate} tok/s</span>
          </span>
        </div>
      </div>
    </div>
  );
}
