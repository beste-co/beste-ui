"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "emerald" | "sky" | "violet";

interface Step {
  label: string;
  lines: string[];
}

interface Commerce32Props {
  steps?: Step[];
  stepMs?: number;
  holdMs?: number;
  tone?: Tone;
  className?: string;
}

const fillClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
};

const nodeClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  emerald: "bg-emerald-500 text-white",
  sky: "bg-sky-500 text-white",
  violet: "bg-violet-500 text-white",
};

const ringClasses: Record<Tone, string> = {
  primary: "ring-primary text-primary",
  foreground: "ring-foreground text-foreground",
  emerald: "ring-emerald-500 text-emerald-500",
  sky: "ring-sky-500 text-sky-500",
  violet: "ring-violet-500 text-violet-500",
};

export const commerce32Demo: Commerce32Props = {
  steps: [
    {
      label: "Cart",
      lines: [
        "Two items",
        "Blue Note Vinyl, Tote Bag",
        "Subtotal $58.00",
      ],
    },
    {
      label: "Shipping",
      lines: ["Nina Simone", "12 Jazz Lane, New Orleans", "Express, arrives Thursday"],
    },
    {
      label: "Payment",
      lines: ["Visa ending 4417", "Billing matches shipping", "Total $64.50"],
    },
    {
      label: "Done",
      lines: ["Order 4821 placed", "Confirmation sent to hello@beste.co"],
    },
  ],
  tone: "primary",
};

export function Commerce32({
  steps = [],
  stepMs = 1500,
  holdMs = 2600,
  tone = "primary",
  className,
}: Commerce32Props) {
  const [active, setActive] = useState(0);
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    if (steps.length < 2) return;
    const last = active >= steps.length - 1;
    const id = setTimeout(
      () => {
        if (last) {
          setInstant(true);
          setActive(0);
        } else {
          setActive((a) => a + 1);
        }
      },
      last ? holdMs : stepMs
    );
    return () => clearTimeout(id);
  }, [active, steps.length, stepMs, holdMs]);

  useEffect(() => {
    if (!instant) return;
    const id = setTimeout(() => setInstant(false), 60);
    return () => clearTimeout(id);
  }, [instant]);

  const finished = active === steps.length - 1;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes commerce32-pop { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
      <div className="flex w-full max-w-80 flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div
          className="grid"
          style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
        >
          {steps.map((step, i) => {
            const isDone = i < active;
            const isActive = i === active;
            return (
              <div
                key={step.label}
                className="relative flex flex-col items-center gap-1.5"
              >
                {i > 0 && (
                  <span
                    className="absolute right-1/2 top-3 w-full -translate-y-1/2 px-4"
                    aria-hidden="true"
                  >
                    <span className="relative block h-0.5 w-full rounded-full bg-muted">
                      <span
                        className={cn(
                          "absolute inset-0 origin-left rounded-full",
                          fillClasses[tone],
                          instant
                            ? "transition-none"
                            : "transition-transform duration-500 ease-out motion-reduce:transition-none",
                          i <= active ? "scale-x-100" : "scale-x-0"
                        )}
                      />
                    </span>
                  </span>
                )}
                <span
                  className={cn(
                    "relative z-10 flex size-6 items-center justify-center rounded-full text-xs font-semibold tabular-nums",
                    instant
                      ? "transition-none"
                      : "transition-all duration-300 delay-200 motion-reduce:transition-none",
                    isDone || (isActive && finished)
                      ? nodeClasses[tone]
                      : isActive
                        ? cn("bg-card ring-2", ringClasses[tone])
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {isDone || (isActive && finished) ? (
                    <Check className="size-3.5" aria-hidden="true" />
                  ) : (
                    i + 1
                  )}
                </span>
                <span
                  className={cn(
                    "max-w-full truncate px-1 text-center text-xs transition-colors",
                    isDone || isActive
                      ? "text-card-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="overflow-hidden rounded-lg bg-muted">
          <div
            className={cn(
              "flex ease-out",
              instant
                ? "transition-none"
                : "transition-transform duration-500 motion-reduce:transition-none"
            )}
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {steps.map((step, i) => {
              const isLast = i === steps.length - 1;
              return (
                <div
                  key={step.label}
                  className="flex h-20 w-full shrink-0 items-center gap-3 px-3"
                >
                  {isLast && (
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full",
                        nodeClasses[tone]
                      )}
                      style={
                        finished
                          ? { animation: "commerce32-pop 400ms ease-out" }
                          : undefined
                      }
                      aria-hidden="true"
                    >
                      <Check className="size-4" />
                    </span>
                  )}
                  <div className="flex min-w-0 flex-col gap-0.5">
                    {step.lines.map((line, j) => (
                      <span
                        key={j}
                        className={cn(
                          "truncate text-sm",
                          j === 0
                            ? "font-medium text-card-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
