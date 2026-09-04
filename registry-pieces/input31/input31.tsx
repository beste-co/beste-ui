"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "typing" | "error" | "verified";

interface Input31Props {
  label?: string;
  hint?: string;
  code?: string;
  wrongCode?: string;
  charMs?: number;
  holdMs?: number;
  className?: string;
}

export const input31Demo: Input31Props = {
  label: "Verification code",
  hint: "Sent to hello@beste.co",
  code: "482913",
  wrongCode: "482910",
};

export function Input31({
  label = "Enter code",
  hint,
  code = "000000",
  wrongCode = "000001",
  charMs = 220,
  holdMs = 2600,
  className,
}: Input31Props) {
  const [attempt, setAttempt] = useState<"wrong" | "right">("wrong");
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");

  const current = attempt === "wrong" ? wrongCode : code;
  const length = code.length;

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      id =
        count < length
          ? setTimeout(() => setCount((c) => c + 1), charMs)
          : setTimeout(() => setPhase(attempt === "wrong" ? "error" : "verified"), 450);
    } else if (phase === "error") {
      id = setTimeout(() => {
        setCount(0);
        setAttempt("right");
        setPhase("typing");
      }, 1000);
    } else {
      id = setTimeout(() => {
        setCount(0);
        setAttempt("wrong");
        setPhase("typing");
      }, holdMs);
    }
    return () => clearTimeout(id);
  }, [phase, count, length, attempt, charMs, holdMs]);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes input31-pop { from { opacity: 0; transform: scale(0.6); } 60% { transform: scale(1.12); } to { opacity: 1; transform: scale(1); } }
@keyframes input31-shake { 0%, 100% { transform: none; } 20% { transform: translateX(-0.25rem); } 40% { transform: translateX(0.25rem); } 60% { transform: translateX(-0.25rem); } 80% { transform: translateX(0.25rem); } }`}</style>
      <div className="flex w-full max-w-80 flex-col gap-2">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-card-foreground">{label}</span>
          {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
        </div>

        <div
          className="flex items-center justify-between gap-1.5 motion-reduce:animate-none"
          style={{ animation: phase === "error" ? "input31-shake 450ms ease-in-out" : undefined }}
          aria-hidden="true"
        >
          {Array.from({ length }, (_, i) => {
            const filled = i < count;
            const active = phase === "typing" && i === count;
            return (
              <span
                key={i}
                className={cn(
                  "flex h-11 flex-1 items-center justify-center rounded-md border bg-card text-lg font-semibold tabular-nums shadow-sm transition-all duration-200",
                  phase === "error" && "border-rose-500 text-rose-600 ring-2 ring-rose-500/20 dark:text-rose-400",
                  phase === "verified" && "border-emerald-500 text-emerald-600 ring-2 ring-emerald-500/20 dark:text-emerald-400",
                  phase === "typing" && active && "border-primary ring-2 ring-primary/20",
                  phase === "typing" && !active && "border-border text-card-foreground"
                )}
              >
                {filled ? (
                  <span
                    key={`${attempt}-${i}`}
                    className="motion-reduce:animate-none"
                    style={{ animation: "input31-pop 220ms ease-out" }}
                  >
                    {current[i]}
                  </span>
                ) : active ? (
                  <span className="h-5 w-0.5 animate-pulse bg-primary motion-reduce:animate-none" />
                ) : null}
              </span>
            );
          })}
        </div>

        <div className="flex h-5 items-center text-xs">
          {phase === "error" ? (
            <span className="text-rose-600 dark:text-rose-400">That code did not match, try again</span>
          ) : phase === "verified" ? (
            <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
              <Check className="size-3.5" aria-hidden="true" />
              Verified
            </span>
          ) : (
            <span className="text-muted-foreground">
              Enter the {length}-digit code
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
