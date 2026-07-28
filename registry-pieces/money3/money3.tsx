"use client";

import { Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "emerald" | "violet" | "sunset";

interface Money3Props {
  balance?: string;
  currency?: string;
  label?: string;
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  emerald: "bg-gradient-to-br from-emerald-500 to-teal-600 text-white",
  violet: "bg-gradient-to-br from-violet-500 to-indigo-600 text-white",
  sunset: "bg-gradient-to-br from-rose-500 to-orange-500 text-white",
};

export const money3Demo: Money3Props = {
  balance: "12,459.20",
  currency: "USD",
  label: "Available balance",
  tone: "emerald",
};

export function Money3({
  balance = "0.00",
  currency = "USD",
  label,
  tone = "emerald",
  className,
}: Money3Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full max-w-64 flex-col gap-2 rounded-xl px-4 py-3 shadow-md",
          toneClasses[tone]
        )}
      >
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-xs font-medium uppercase tracking-wide opacity-80">
              {label}
            </span>
          )}
          <Wallet className="size-4 opacity-90" aria-hidden="true" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tabular-nums">{balance}</span>
          <span className="text-sm font-semibold opacity-80">{currency}</span>
        </div>
      </div>
    </div>
  );
}
