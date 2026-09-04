"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "emerald" | "sky" | "violet";
type Phase = "idle" | "travel" | "arrived";

interface Person {
  name: string;
  initials: string;
}

interface Money26Props {
  sender?: Person;
  recipient?: Person;
  amount?: number;
  idleMs?: number;
  travelMs?: number;
  holdMs?: number;
  tone?: Tone;
  className?: string;
}

const coinClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  emerald: "bg-emerald-500 text-white",
  sky: "bg-sky-500 text-white",
  violet: "bg-violet-500 text-white",
};

const ringClasses: Record<Tone, string> = {
  primary: "border-primary",
  foreground: "border-foreground",
  emerald: "border-emerald-500",
  sky: "border-sky-500",
  violet: "border-violet-500",
};

const trackClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
};

const statusLabels: Record<Phase, string> = {
  idle: "Ready",
  travel: "Sending",
  arrived: "Delivered",
};

export const money26Demo: Money26Props = {
  sender: { name: "Nina Simone", initials: "NS" },
  recipient: { name: "Miles Davis", initials: "MD" },
  amount: 250,
  tone: "emerald",
};

export function Money26({
  sender = { name: "Sender", initials: "S" },
  recipient = { name: "Recipient", initials: "R" },
  amount = 0,
  idleMs = 900,
  travelMs = 1400,
  holdMs = 2400,
  tone = "emerald",
  className,
}: Money26Props) {
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    const delay =
      phase === "idle" ? idleMs : phase === "travel" ? travelMs : holdMs;
    const id = setTimeout(() => {
      setPhase((p) =>
        p === "idle" ? "travel" : p === "travel" ? "arrived" : "idle"
      );
    }, delay);
    return () => clearTimeout(id);
  }, [phase, idleMs, travelMs, holdMs]);

  const traveling = phase === "travel";
  const arrived = phase === "arrived";

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
      <style>{`
@keyframes money26-fly { from { left: 0%; } to { left: 100%; } }
@keyframes money26-hop { 0% { opacity: 0; transform: translateY(0) scale(0.4); } 16% { opacity: 1; transform: translateY(-0.5rem) scale(1); } 50% { transform: translateY(-0.8rem) scale(1); } 84% { opacity: 1; transform: translateY(-0.5rem) scale(1); } 100% { opacity: 0; transform: translateY(0) scale(0.4); } }
@keyframes money26-fill { from { width: 0%; } to { width: 100%; } }
@keyframes money26-nudge { 0%, 100% { transform: scale(1); } 45% { transform: scale(0.88); } }
@keyframes money26-land { 0% { transform: scale(1); } 40% { transform: scale(1.16); } 70% { transform: scale(0.97); } 100% { transform: scale(1); } }
@keyframes money26-ring { from { opacity: 0.5; transform: scale(1); } to { opacity: 0; transform: scale(1.9); } }
@keyframes money26-float { 0% { opacity: 0; transform: translateY(0.25rem) scale(0.8); } 25% { opacity: 1; transform: translateY(-0.5rem) scale(1); } 70% { opacity: 1; transform: translateY(-1rem); } 100% { opacity: 0; transform: translateY(-1.5rem); } }
@keyframes money26-in { from { opacity: 0; transform: translateY(0.25rem); } to { opacity: 1; transform: none; } }
`}</style>

      <div className="flex w-full max-w-72 flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Transfer</span>
          <span>{statusLabels[phase]}</span>
        </div>

        <div className="flex items-start pt-3">
          <div className="flex w-16 shrink-0 flex-col items-center gap-1.5">
            <span
              className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-semibold text-card-foreground"
              style={
                traveling
                  ? { animation: "money26-nudge 500ms ease-out" }
                  : undefined
              }
            >
              {sender.initials}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {sender.name}
            </span>
          </div>

          <div
            className="relative mt-5 h-0.5 rounded-full bg-muted flex-1"
            aria-hidden="true"
          >
            <span
              className={cn(
                "absolute inset-y-0 left-0 rounded-full transition-all duration-300 ease-out motion-reduce:transition-none",
                trackClasses[tone]
              )}
              style={
                traveling
                  ? { animation: `money26-fill ${travelMs}ms linear forwards` }
                  : { width: arrived ? "100%" : "0%" }
              }
            />

            {traveling && (
              <span
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 motion-reduce:hidden"
                style={{ animation: `money26-fly ${travelMs}ms linear forwards` }}
              >
                <span
                  className={cn(
                    "flex h-6 items-center rounded-full px-2 text-xs font-semibold tabular-nums shadow-md",
                    coinClasses[tone]
                  )}
                  style={{ animation: `money26-hop ${travelMs}ms ease-in-out forwards` }}
                >
                  {formatted}
                </span>
              </span>
            )}
          </div>

          <div className="relative flex w-16 shrink-0 flex-col items-center gap-1.5">
            {arrived && (
              <span
                className="pointer-events-none absolute inset-x-0 top-0 flex justify-center"
                aria-hidden="true"
              >
                <span
                  className="whitespace-nowrap rounded-full bg-emerald-500 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-white shadow-sm"
                  style={{ animation: "money26-float 1400ms ease-out both" }}
                >
                  +{formatted}
                </span>
              </span>
            )}

            <span
              className={cn(
                "relative flex size-10 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-300 motion-reduce:transition-none",
                arrived ? coinClasses[tone] : "bg-muted text-card-foreground"
              )}
              style={
                arrived ? { animation: "money26-land 520ms ease-out" } : undefined
              }
            >
              {arrived && (
                <span
                  className={cn(
                    "absolute inset-0 rounded-full border-2",
                    ringClasses[tone]
                  )}
                  style={{ animation: "money26-ring 700ms ease-out both" }}
                  aria-hidden="true"
                />
              )}
              {recipient.initials}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {recipient.name}
            </span>
          </div>
        </div>

        <div className="flex h-5 items-center justify-center">
          {arrived ? (
            <span
              className="inline-flex items-center gap-1 text-sm font-medium tabular-nums text-card-foreground"
              style={{ animation: "money26-in 350ms ease-out" }}
            >
              <Check className="size-3.5 text-emerald-500" aria-hidden="true" />
              {formatted} delivered
            </span>
          ) : (
            <span className="text-sm tabular-nums text-muted-foreground">
              {formatted} to {recipient.name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
