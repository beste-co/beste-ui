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
  type: string;
  notes: string;
}

interface Food10Props {
  dish?: string;
  pairings?: Pairing[];
  tone?: Tone;
  className?: string;
}

const tileClasses: Record<Tone, string> = {
  neutral: "bg-muted text-card-foreground",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  rose: "bg-rose-500 text-white",
  amber: "bg-amber-500 text-white",
  emerald: "bg-emerald-500 text-white",
  sky: "bg-sky-500 text-white",
  violet: "bg-violet-500 text-white",
};

export const food10Demo: Food10Props = {
  dish: "Seared duck breast",
  pairings: [
    {
      name: "Pinot Noir · Willamette",
      type: "Red · 2021",
      notes: "Bright cherry, subtle forest floor.",
    },
    {
      name: "Bourbon old-fashioned",
      type: "Cocktail",
      notes: "Bittersweet, amplifies the glaze.",
    },
  ],
  tone: "rose",
};

export function Food10({
  dish,
  pairings = [],
  tone = "rose",
  className,
}: Food10Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-7 items-center justify-center rounded-md",
              tileClasses[tone]
            )}
          >
            <Wine className="size-3.5" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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
              className="rounded-md border border-border bg-muted p-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-card-foreground">
                  {p.name}
                </span>
                <span className="text-muted-foreground">{p.type}</span>
              </div>
              <span className="italic text-muted-foreground">{p.notes}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
