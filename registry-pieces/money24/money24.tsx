"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "idle" | "processing" | "success";

interface Money24Props {
  merchant?: string;
  amount?: number;
  cardLabel?: string;
  last4?: string;
  idleMs?: number;
  processMs?: number;
  holdMs?: number;
  loop?: boolean;
  bordered?: boolean;
  className?: string;
}

export const money24Demo: Money24Props = {
  merchant: "Beste Studio",
  amount: 128,
  cardLabel: "Visa",
  last4: "4417",
  bordered: false,
};

export function Money24({
  merchant = "Merchant",
  amount = 0,
  cardLabel = "Card",
  last4 = "0000",
  idleMs = 1400,
  processMs = 1600,
  holdMs = 2600,
  loop = true,
  bordered = false,
  className,
}: Money24Props) {
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    if (phase === "success" && !loop) return;
    const delay =
      phase === "idle" ? idleMs : phase === "processing" ? processMs : holdMs;
    const id = setTimeout(() => {
      setPhase((p) =>
        p === "idle" ? "processing" : p === "processing" ? "success" : "idle"
      );
    }, delay);
    return () => clearTimeout(id);
  }, [phase, idleMs, processMs, holdMs, loop]);

  const formatted = `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes money24-ring { from { transform: translate(-50%, -50%) scale(0.4); opacity: 0.9; } to { transform: translate(-50%, -50%) scale(2.6); opacity: 0; } } @keyframes money24-pop { from { transform: scale(0.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
      <div className={cn("flex w-full max-w-72 flex-col gap-4 rounded-xl bg-card p-4 shadow-sm", bordered && "border border-border")}>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm text-muted-foreground">
            Pay {merchant}
          </span>
          <span className="text-2xl font-semibold tracking-tight tabular-nums text-card-foreground">
            {formatted}
          </span>
        </div>

        <div className={cn("flex items-center gap-2.5 rounded-lg px-3 py-2", bordered ? "border border-border" : "bg-muted")}>
          <span className="text-sm text-card-foreground">{cardLabel}</span>
          <span className="ml-auto text-sm tabular-nums text-muted-foreground">
            •••• {last4}
          </span>
        </div>

        <button
          type="button"
          className={cn(
            "relative flex h-9 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg text-sm font-medium transition-colors duration-300 motion-reduce:transition-none",
            phase === "success"
              ? "bg-emerald-500 text-white"
              : "bg-primary text-primary-foreground"
          )}
        >
          {phase === "success" && (
            <span
              className="absolute left-1/2 top-1/2 size-8 rounded-full border-2 border-white motion-reduce:hidden"
              style={{ animation: "money24-ring 700ms ease-out forwards" }}
              aria-hidden="true"
            />
          )}
          {phase === "idle" && <span>Pay</span>}
          {phase === "processing" && (
            <>
              <Loader2
                className="size-4 animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
              <span>Processing</span>
            </>
          )}
          {phase === "success" && (
            <Check
              className="relative size-5"
              style={{ animation: "money24-pop 350ms ease-out" }}
              aria-hidden="true"
            />
          )}
        </button>
      </div>
    </div>
  );
}
