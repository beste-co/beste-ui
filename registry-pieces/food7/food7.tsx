"use client";

import { ChefHat, Clock, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "sunset"
  | "emerald"
  | "sky"
  | "violet"
  | "amber"
  | "rose";

interface Ingredient {
  qty: string;
  item: string;
}

interface Food7Props {
  recipe?: string;
  servings?: number;
  cookTime?: string;
  calories?: string;
  ingredients?: Ingredient[];
  tone?: Tone;
  className?: string;
}

const tileClasses: Record<Tone, string> = {
  neutral: "bg-muted text-card-foreground",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sunset: "bg-gradient-to-br from-rose-500 to-orange-500 text-white",
  emerald: "bg-emerald-500 text-white",
  sky: "bg-sky-500 text-white",
  violet: "bg-violet-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
};

export const food7Demo: Food7Props = {
  recipe: "Lemon-thyme chicken",
  servings: 4,
  cookTime: "45 min",
  calories: "480 kcal",
  ingredients: [
    { qty: "4", item: "chicken thighs" },
    { qty: "2", item: "lemons, zest and juice" },
    { qty: "3 tbsp", item: "olive oil" },
    { qty: "4 sprigs", item: "fresh thyme" },
  ],
  tone: "sunset",
};

export function Food7({
  recipe,
  servings = 1,
  cookTime,
  calories,
  ingredients = [],
  tone = "sunset",
  className,
}: Food7Props) {
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
              "flex size-8 items-center justify-center rounded-md",
              tileClasses[tone]
            )}
          >
            <ChefHat className="size-4" aria-hidden="true" />
          </div>
          {recipe && (
            <span className="text-sm font-semibold text-card-foreground">
              {recipe}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" aria-hidden="true" />
            {cookTime}
          </span>
          <span className="inline-flex items-center gap-1">
            <Flame className="size-3" aria-hidden="true" />
            {calories}
          </span>
          <span>{servings} servings</span>
        </div>
        <div className="flex flex-col divide-y divide-border">
          {ingredients.map((item, idx) => (
            <div
              key={idx}
              className="flex items-baseline gap-2 py-1 text-xs"
            >
              <span className="w-16 shrink-0 font-mono text-muted-foreground">
                {item.qty}
              </span>
              <span className="flex-1 truncate text-card-foreground">
                {item.item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
