"use client";

import { useEffect, useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Ai50Props {
  prompt?: string;
  reply?: string;
  model?: string;
  tokenMs?: number;
  holdMs?: number;
  className?: string;
}

export const ai50Demo: Ai50Props = {
  prompt: "Name three quick wins for our onboarding.",
  reply:
    "Shorten the signup form to email only, show a sample project on first login, and send a nudge after 24 hours of inactivity.",
  model: "beste-1",
};

export function Ai50({
  prompt = "Ask anything",
  reply = "",
  model = "assistant",
  tokenMs = 110,
  holdMs = 2800,
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
      <div className="flex w-full max-w-80 flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm">
        <div className="flex justify-end">
          <p className="max-w-64 rounded-2xl rounded-br-sm bg-muted px-3 py-1.5 text-sm leading-snug text-card-foreground">
            {prompt}
          </p>
        </div>

        <div className="flex items-start gap-2">
          <span
            className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-violet-500 text-white"
            aria-hidden="true"
          >
            <Sparkles className="size-3.5" />
          </span>
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
          <span className="rounded-full border border-border px-2 py-0.5 font-mono">
            {model}
          </span>
          <span className="inline-flex items-center gap-3 tabular-nums">
            <span>{count} tokens</span>
            <span>{done ? 0 : rate} tok/s</span>
            {done ? (
              <Check className="size-3.5 text-emerald-500" aria-hidden="true" />
            ) : (
              <span className="relative flex size-1.5" aria-hidden="true">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-violet-500 opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex size-1.5 rounded-full bg-violet-500" />
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
