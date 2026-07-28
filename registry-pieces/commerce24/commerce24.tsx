"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber"
  | "rose";

interface Commerce24Installment {
  amount: string;
  date: string;
  paid?: boolean;
}

interface Commerce24Props {
  total?: string;
  provider?: string;
  installments?: Commerce24Installment[];
  fineprint?: string;
  tone?: Tone;
  className?: string;
}

const dotPaid: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  violet: "bg-violet-500 text-white",
  emerald: "bg-emerald-500 text-white",
  sky: "bg-sky-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
};

const lineFill: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

const dotRing: Record<Tone, string> = {
  primary: "border-primary",
  foreground: "border-foreground",
  violet: "border-violet-500",
  emerald: "border-emerald-500",
  sky: "border-sky-500",
  amber: "border-amber-500",
  rose: "border-rose-500",
};

export const commerce24Demo: Commerce24Props = {
  total: "$192",
  provider: "Klarna",
  installments: [
    { amount: "$48", date: "Today", paid: true },
    { amount: "$48", date: "Apr 28" },
    { amount: "$48", date: "May 5" },
    { amount: "$48", date: "May 12" },
  ],
  fineprint: "0% interest. No fees.",
  tone: "primary",
};

export function Commerce24({
  total,
  provider = "Pay later",
  installments = [],
  fineprint,
  tone = "primary",
  className,
}: Commerce24Props) {
  const firstUnpaid = installments.findIndex((i) => !i.paid);
  const currentIndex = firstUnpaid === -1 ? installments.length : firstUnpaid;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-3 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Pay in {installments.length}
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs font-medium text-card-foreground">
              {provider}
            </span>
          </div>
          {total && (
            <span className="font-mono text-sm font-semibold tabular-nums text-card-foreground">
              {total}
            </span>
          )}
        </div>
        <div className="relative flex items-start justify-between px-1.5">
          {installments.length > 1 && (
            <>
              <span
                className="absolute left-3 right-3 top-2 h-0.5 -translate-y-1/2 bg-muted"
                aria-hidden="true"
              />
              {currentIndex > 0 && (
                <span
                  className={cn(
                    "absolute left-3 top-2 h-0.5 -translate-y-1/2",
                    lineFill[tone]
                  )}
                  style={{
                    width: `calc((100% - 1.5rem) * ${
                      Math.min(currentIndex, installments.length - 1) /
                      Math.max(1, installments.length - 1)
                    })`,
                  }}
                  aria-hidden="true"
                />
              )}
            </>
          )}
          {installments.map((it, i) => {
            const isCurrent = i === currentIndex && !it.paid;
            return (
              <div
                key={i}
                className="relative flex flex-col items-center gap-1.5"
              >
                <span
                  className={cn(
                    "flex size-4 items-center justify-center rounded-full border-2 border-card",
                    it.paid
                      ? dotPaid[tone]
                      : isCurrent
                        ? cn("bg-card", dotRing[tone])
                        : "bg-muted"
                  )}
                  aria-hidden="true"
                >
                  {it.paid && <Check className="size-2.5" strokeWidth={3} />}
                </span>
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      "font-mono text-xs font-semibold tabular-nums",
                      it.paid
                        ? "text-muted-foreground line-through"
                        : "text-card-foreground"
                    )}
                  >
                    {it.amount}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {it.date}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        {fineprint && (
          <span className="border-t border-border pt-2 text-xs text-muted-foreground">
            {fineprint}
          </span>
        )}
      </div>
    </div>
  );
}
