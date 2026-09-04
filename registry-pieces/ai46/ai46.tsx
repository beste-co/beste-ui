"use client";

import { useEffect, useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "thinking" | "typing" | "done";

interface Ai46Props {
  prompt?: string;
  reply?: string;
  model?: string;
  charMs?: number;
  thinkMs?: number;
  holdMs?: number;
  loop?: boolean;
  className?: string;
}

export const ai46Demo: Ai46Props = {
  prompt: "Summarize this week's support tickets in two lines.",
  reply:
    "Most tickets were about delayed invoices; a fix ships Friday. Login issues dropped 40% after the password reset change.",
  model: "beste-1",
};

export function Ai46({
  prompt = "Ask anything",
  reply = "",
  model = "assistant",
  charMs = 22,
  thinkMs = 1400,
  holdMs = 2600,
  loop = true,
  className,
}: Ai46Props) {
  const [phase, setPhase] = useState<Phase>("thinking");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (phase === "thinking") {
      const id = setTimeout(() => {
        setCount(0);
        setPhase("typing");
      }, thinkMs);
      return () => clearTimeout(id);
    }
    if (phase === "typing") {
      if (count >= reply.length) {
        setPhase("done");
        return;
      }
      const id = setTimeout(() => setCount((c) => c + 1), charMs);
      return () => clearTimeout(id);
    }
    if (!loop) return;
    const id = setTimeout(() => setPhase("thinking"), holdMs);
    return () => clearTimeout(id);
  }, [phase, count, reply.length, charMs, thinkMs, holdMs, loop]);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
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
          <div className="min-w-0 flex-1 text-sm leading-snug text-card-foreground">
            {phase === "thinking" ? (
              <span
                className="inline-flex h-5 items-center gap-1"
                aria-label="Thinking"
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-1.5 animate-bounce rounded-full bg-muted-foreground motion-reduce:animate-none"
                    style={{ animationDelay: `${i * 150}ms` }}
                    aria-hidden="true"
                  />
                ))}
              </span>
            ) : (
              <p className="relative">
                <span className="invisible" aria-hidden="true">
                  {reply}
                </span>
                <span className="absolute inset-0">
                  {reply.slice(0, count)}
                  {phase === "typing" && (
                    <span
                      className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 animate-pulse bg-violet-500"
                      aria-hidden="true"
                    />
                  )}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="rounded-full border border-border px-2 py-0.5 font-mono">
            {model}
          </span>
          <span className="inline-flex items-center gap-1.5">
            {phase === "done" ? (
              <>
                <Check className="size-3 text-emerald-500" aria-hidden="true" />
                Done
              </>
            ) : (
              <>
                <span className="relative flex size-1.5" aria-hidden="true">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-violet-500 opacity-75 motion-reduce:animate-none" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-violet-500" />
                </span>
                {phase === "thinking" ? "Thinking" : "Streaming"}
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
