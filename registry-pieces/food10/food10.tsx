"use client";

import { Wine } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "rose"
  | "amber"
  | "emerald"
  | "sky"
  | "violet";

interface Pairing {
  name: string;
  type?: string;
  notes?: string;
}

interface Food10Props {
  dish?: string;
  pairings?: Pairing[];
  tone?: Tone;
  bordered?: boolean;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  neutral: "text-card-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  rose: "text-rose-500",
  amber: "text-amber-500",
  emerald: "text-emerald-500",
  sky: "text-sky-500",
  violet: "text-violet-500",
};

export const food10Demo: Food10Props = {
  dish: "Seared duck breast",
  pairings: [
    { name: "Pinot Noir", type: "Red" },
    { name: "Old-fashioned", type: "Cocktail" },
  ],
  tone: "primary",
  bordered: false,
};

export function Food10({
  dish,
  pairings = [],
  tone = "primary",
  bordered = false,
  className,
}: Food10Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <Wine
            className={cn("size-4 shrink-0", iconClasses[tone])}
            aria-hidden="true"
          />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-muted-foreground">
              Pairs well with
            </span>
            {dish && (
              <span className="text-sm font-semibold text-card-foreground">
                {dish}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {pairings.map((p, idx) => (
            <div
              key={idx}
              className={cn("rounded-md bg-muted p-2 text-xs", bordered && "border border-border")}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-card-foreground">
                  {p.name}
                </span>
                {p.type && (
                  <span className="text-muted-foreground">{p.type}</span>
                )}
              </div>
              {p.notes && (
                <span className="italic text-muted-foreground">{p.notes}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
