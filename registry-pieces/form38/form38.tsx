"use client";

import { useEffect, useState } from "react";
import { MousePointer2, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Form38Props {
  prompt?: string;
  thanks?: string;
  pick?: number;
  stars?: number;
  cursorMs?: number;
  holdMs?: number;
  className?: string;
}

export const form38Demo: Form38Props = {
  prompt: "How was your experience?",
  thanks: "Thanks for the feedback!",
  pick: 4,
};

export function Form38({
  prompt = "How was your experience?",
  thanks = "Thanks!",
  pick = 4,
  stars = 5,
  cursorMs = 260,
  holdMs = 2600,
  className,
}: Form38Props) {
  // step: -1 idle, 0..pick-1 hovering, pick = chosen, pick+1 = thanks
  const [step, setStep] = useState(-1);
  // Stars light only once the pointer has landed on them, never before.
  const [lit, setLit] = useState(0);

  const target = Math.min(Math.max(1, pick), stars);
  const picked = lit >= target;
  const thanked = step > target;

  useEffect(() => {
    if (step < 0) {
      setLit(0);
      return;
    }
    const id = setTimeout(
      () => setLit(Math.min(step + 1, target)),
      cursorMs
    );
    return () => clearTimeout(id);
  }, [step, target, cursorMs]);

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;
    if (step < 0) {
      id = setTimeout(() => setStep(0), 700);
    } else if (step < target) {
      id = setTimeout(() => setStep((s) => s + 1), step === target - 1 ? 650 : 450);
    } else if (step === target) {
      id = setTimeout(() => setStep((s) => s + 1), 700);
    } else {
      id = setTimeout(() => setStep(-1), holdMs);
    }
    return () => clearTimeout(id);
  }, [step, target, holdMs]);

  const cursorStep = Math.min(Math.max(step, 0), target - 1);
  const cursorLeft = ((cursorStep + 0.5) * 100) / stars;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes form38-pop { 0% { transform: scale(1); } 40% { transform: scale(1.35); } 100% { transform: scale(1); } }`}</style>
      <div className="flex w-full max-w-72 flex-col items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="relative flex h-5 w-full items-center justify-center">
          <p
            className={cn(
              "absolute text-sm font-medium text-card-foreground transition-opacity duration-300 motion-reduce:transition-none",
              thanked ? "opacity-0" : "opacity-100"
            )}
          >
            {prompt}
          </p>
          <p
            className={cn(
              "absolute text-sm font-medium text-emerald-600 transition-opacity duration-300 motion-reduce:transition-none dark:text-emerald-400",
              thanked ? "opacity-100" : "opacity-0"
            )}
          >
            {thanks}
          </p>
        </div>

        <div className="relative flex gap-1">
          {Array.from({ length: stars }, (_, i) => {
            const on = i < lit;
            const chosen = picked && i === target - 1;
            return (
              <button
                key={i}
                type="button"
                aria-label={`Rate ${i + 1} of ${stars}`}
                className={cn(
                  "flex size-8 cursor-pointer items-center justify-center rounded-md transition-colors duration-200 hover:bg-muted motion-reduce:animate-none",
                  on ? "text-amber-400" : "text-muted-foreground"
                )}
                style={chosen ? { animation: "form38-pop 400ms ease-out" } : undefined}
              >
                <Star
                  className={cn("size-6 transition-colors duration-200", on && "fill-current")}
                  aria-hidden="true"
                />
              </button>
            );
          })}
          <span
            className={cn(
              "pointer-events-none absolute top-1/2 text-foreground drop-shadow-sm transition-all ease-out motion-reduce:transition-none",
              step < 0 || thanked ? "opacity-0" : "opacity-100"
            )}
            style={{
              left: `${cursorLeft}%`,
              transform: picked ? "scale(0.85)" : "scale(1)",
              transitionDuration: `${cursorMs}ms`,
            }}
            aria-hidden="true"
          >
            <MousePointer2 className="size-4 fill-background" />
          </span>
        </div>

        <p className="h-4 text-xs tabular-nums text-muted-foreground">
          {picked ? `${target} of ${stars} stars` : "Tap a star to rate"}
        </p>
      </div>
    </div>
  );
}
