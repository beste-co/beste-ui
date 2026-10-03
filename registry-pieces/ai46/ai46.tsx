"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
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
  bordered?: boolean;
  className?: string;
}

export const ai46Demo: Ai46Props = {
  prompt: "Summarize this week's support tickets in two lines.",
  reply:
    "Most tickets were about delayed invoices; a fix ships Friday. Login issues dropped 40% after the password reset change.",
  bordered: false,
};

export function Ai46({
  prompt = "Ask anything",
  reply = "",
  model,
  charMs = 22,
  thinkMs = 1400,
  holdMs = 2600,
  loop = true,
  bordered = false,
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
      <div className={cn("flex w-full max-w-80 flex-col gap-3 rounded-2xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex justify-end">
          <p className="max-w-64 rounded-2xl rounded-br-sm bg-muted px-3 py-1.5 text-sm leading-snug text-card-foreground">
            {prompt}
          </p>
        </div>

        <div className="flex items-start gap-2">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
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
                      className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 animate-pulse bg-primary"
                      aria-hidden="true"
                    />
                  )}
                </span>
              </p>
            )}
          </div>
        </div>

        {model && (
          <span className={cn("self-start rounded-full px-2 py-0.5 text-xs text-muted-foreground", bordered ? "border border-border" : "bg-muted")}>
            {model}
          </span>
        )}
      </div>
    </div>
  );
}
