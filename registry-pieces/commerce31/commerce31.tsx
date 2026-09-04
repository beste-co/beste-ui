"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "emerald" | "sky" | "violet";
type Phase = "idle" | "press" | "fly" | "bump" | "hold";

interface Commerce31Props {
  name?: string;
  initials?: string;
  price?: number;
  maxCount?: number;
  tone?: Tone;
  className?: string;
}

const tileClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  emerald: "bg-emerald-500 text-white",
  sky: "bg-sky-500 text-white",
  violet: "bg-violet-500 text-white",
};

const dotClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
};

export const commerce31Demo: Commerce31Props = {
  name: "Blue Note Vinyl",
  initials: "BN",
  price: 34,
  maxCount: 3,
  tone: "violet",
};

export function Commerce31({
  name = "Product",
  initials = "P",
  price = 0,
  maxCount = 3,
  tone = "violet",
  className,
}: Commerce31Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [count, setCount] = useState(0);

  useEffect(() => {
    const delays: Record<Phase, number> = {
      idle: 900,
      press: 220,
      fly: 650,
      bump: 500,
      hold: 2400,
    };
    const id = setTimeout(() => {
      if (phase === "idle") setPhase("press");
      else if (phase === "press") setPhase("fly");
      else if (phase === "fly") {
        setCount((c) => c + 1);
        setPhase("bump");
      } else if (phase === "bump") {
        setPhase(count >= maxCount ? "hold" : "idle");
      } else {
        setCount(0);
        setPhase("idle");
      }
    }, delays[phase]);
    return () => clearTimeout(id);
  }, [phase, count, maxCount]);

  const formatted = `$${price.toLocaleString("en-US", {
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
      <style>{`@keyframes commerce31-fly-x { from { transform: translateX(0); } to { transform: translateX(0.75rem); } } @keyframes commerce31-fly-y { 0% { transform: translateY(0) scale(1); } 55% { transform: translateY(-3.5rem) scale(1); } 100% { transform: translateY(-3rem) scale(0.4); } } @keyframes commerce31-bump { 0% { transform: scale(1); } 40% { transform: scale(1.35); } 100% { transform: scale(1); } }`}</style>
      <div className="flex w-full max-w-72 flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex h-8 items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {count === 0
              ? "Your cart is empty"
              : `${count} ${count === 1 ? "item" : "items"} in cart`}
          </span>
          <span className="relative flex size-8 items-center justify-center rounded-lg bg-muted text-card-foreground">
            <ShoppingCart className="size-4" aria-hidden="true" />
            {count > 0 && (
              <span
                key={count}
                className={cn(
                  "absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-xs font-semibold tabular-nums motion-reduce:animate-none",
                  tileClasses[tone]
                )}
                style={{ animation: "commerce31-bump 400ms ease-out" }}
              >
                {count}
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold",
              tileClasses[tone]
            )}
            aria-hidden="true"
          >
            {initials}
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium text-card-foreground">
              {name}
            </span>
            <span className="text-xs tabular-nums text-muted-foreground">
              {formatted}
            </span>
          </div>
          <span className="relative flex shrink-0">
            <button
              type="button"
              className={cn(
                "h-8 cursor-pointer rounded-lg border border-border bg-card px-3 text-sm font-medium text-card-foreground transition-transform duration-200 ease-out motion-reduce:transition-none",
                phase === "press" ? "scale-90" : "scale-100"
              )}
            >
              Add
            </button>
            {phase === "fly" && (
              <span
                className="pointer-events-none absolute left-1/2 top-1/2 -ml-1 -mt-1 motion-reduce:hidden"
                style={{ animation: "commerce31-fly-x 650ms linear forwards" }}
                aria-hidden="true"
              >
                <span
                  className={cn("block size-2 rounded-full", dotClasses[tone])}
                  style={{
                    animation: "commerce31-fly-y 650ms ease-in-out forwards",
                  }}
                />
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
