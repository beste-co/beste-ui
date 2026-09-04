"use client";

import { useEffect, useState } from "react";
import { Check, Circle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "typing" | "hold" | "clearing" | "pause";

interface Input32Props {
  label?: string;
  password?: string;
  charMs?: number;
  holdMs?: number;
  className?: string;
}

const LEVELS = [
  { label: "", classes: "bg-muted" },
  { label: "Weak", classes: "bg-rose-500" },
  { label: "Fair", classes: "bg-amber-500" },
  { label: "Good", classes: "bg-emerald-500" },
  { label: "Strong", classes: "bg-emerald-500" },
];

const LEVEL_TEXT = [
  "text-muted-foreground",
  "text-rose-600 dark:text-rose-400",
  "text-amber-600 dark:text-amber-400",
  "text-emerald-600 dark:text-emerald-400",
  "text-emerald-600 dark:text-emerald-400",
];

export const input32Demo: Input32Props = {
  label: "Choose a password",
  password: "Moonriver-77!",
};

export function Input32({
  label = "Password",
  password = "Sunrise-42!",
  charMs = 140,
  holdMs = 2400,
  className,
}: Input32Props) {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      id =
        count < password.length
          ? setTimeout(() => setCount((c) => c + 1), charMs)
          : setTimeout(() => setPhase("hold"), 200);
    } else if (phase === "hold") {
      id = setTimeout(() => setPhase("clearing"), holdMs);
    } else if (phase === "clearing") {
      id =
        count > 0
          ? setTimeout(() => setCount((c) => c - 1), 35)
          : setTimeout(() => setPhase("pause"), 100);
    } else {
      id = setTimeout(() => setPhase("typing"), 600);
    }
    return () => clearTimeout(id);
  }, [phase, count, password.length, charMs, holdMs]);

  const typed = password.slice(0, count);
  const rules = [
    { label: "At least 8 characters", ok: typed.length >= 8 },
    { label: "Contains a number", ok: /\d/.test(typed) },
    { label: "Contains a symbol", ok: /[^A-Za-z0-9]/.test(typed) },
  ];
  const score = Math.min(4, (typed.length > 0 ? 1 : 0) + rules.filter((r) => r.ok).length);
  const level = LEVELS[score];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2">
        <span className="text-sm font-medium text-card-foreground">{label}</span>

        <div
          className={cn(
            "flex h-10 items-center gap-2 rounded-md border bg-card px-3 shadow-sm transition-colors duration-300",
            phase === "typing" ? "border-primary ring-2 ring-primary/20" : "border-border"
          )}
        >
          <Lock className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="flex min-w-0 flex-1 items-center text-sm tracking-widest text-card-foreground">
            <span className="sr-only">{typed.length} characters entered</span>
            <span className="truncate" aria-hidden="true">
              {"•".repeat(count)}
            </span>
            <span
              className="h-4 w-0.5 shrink-0 animate-pulse bg-foreground motion-reduce:animate-none"
              aria-hidden="true"
            />
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-1 gap-1" aria-hidden="true">
            {[1, 2, 3, 4].map((n) => (
              <span
                key={n}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors duration-300 ease-out motion-reduce:transition-none",
                  n <= score ? level.classes : "bg-muted"
                )}
              />
            ))}
          </div>
          <span
            className={cn(
              "w-12 text-right text-xs font-medium transition-colors duration-300",
              LEVEL_TEXT[score]
            )}
          >
            {level.label}
          </span>
        </div>

        <ul className="flex flex-col gap-1">
          {rules.map((rule) => (
            <li
              key={rule.label}
              className={cn(
                "flex items-center gap-2 text-xs transition-colors duration-300",
                rule.ok ? "text-card-foreground" : "text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                  rule.ok ? "bg-emerald-500 text-white" : "text-muted-foreground"
                )}
                aria-hidden="true"
              >
                {rule.ok ? <Check className="size-3" /> : <Circle className="size-3" />}
              </span>
              {rule.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
