"use client";

import { useEffect, useState } from "react";
import { Nfc } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "emerald" | "sky" | "violet";

interface Money28Props {
  brand?: string;
  holder?: string;
  last4?: string;
  expiry?: string;
  tone?: Tone;
  className?: string;
}

const cardClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  emerald: "bg-emerald-600 text-white",
  sky: "bg-sky-600 text-white",
  violet: "bg-violet-600 text-white",
};

export const money28Demo: Money28Props = {
  brand: "beste",
  holder: "Herbie Hancock",
  last4: "4417",
  expiry: "09/29",
  tone: "foreground",
};

export function Money28({
  brand = "card",
  holder = "Card holder",
  last4 = "0000",
  expiry = "01/30",
  tone = "foreground",
  className,
}: Money28Props) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const ids = [1, 2, 3, 4, 5].map((n) =>
      setTimeout(() => setStep(n), 700 + n * 260)
    );
    return () => ids.forEach(clearTimeout);
  }, []);

  const groups = ["••••", "••••", "••••", last4];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes money28-flip { from { opacity: 0; transform: perspective(50rem) rotateY(-28deg) translateY(0.5rem); } to { opacity: 1; transform: perspective(50rem) rotateY(0) translateY(0); } }`}</style>
      <div
        className={cn(
          "flex h-44 w-full max-w-72 flex-col justify-between rounded-2xl p-5 shadow-md motion-reduce:animate-none",
          cardClasses[tone]
        )}
        style={{ animation: "money28-flip 700ms ease-out both" }}
      >
        <div className="flex items-start justify-between">
          <span
            className="flex h-6 w-8 items-center justify-center rounded-md bg-current/20"
            aria-hidden="true"
          >
            <span className="h-3 w-5 rounded-sm border border-current/40" />
          </span>
          <span className="inline-flex items-center gap-2">
            <Nfc className="size-4 opacity-70" aria-hidden="true" />
            <span className="text-sm font-semibold tracking-wide">{brand}</span>
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-lg tracking-widest tabular-nums">
          <span className="sr-only">Card ending {last4}</span>
          {groups.map((group, i) => (
            <span
              key={i}
              className={cn(
                "transition-all duration-500 ease-out motion-reduce:transition-none",
                step > i ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
              )}
              aria-hidden="true"
            >
              {group}
            </span>
          ))}
        </div>

        <div
          className={cn(
            "flex items-end justify-between transition-all duration-500 ease-out motion-reduce:transition-none",
            step > 4 ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
          )}
        >
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wide opacity-60">
              Card holder
            </span>
            <span className="text-sm font-medium">{holder}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs uppercase tracking-wide opacity-60">
              Expires
            </span>
            <span className="text-sm font-medium tabular-nums">{expiry}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
