"use client";

import { ChefHat } from "lucide-react";
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
  bordered?: boolean;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  neutral: "text-card-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  sunset: "text-rose-500",
  emerald: "text-emerald-500",
  sky: "text-sky-500",
  violet: "text-violet-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
};

export const food7Demo: Food7Props = {
  recipe: "Lemon-thyme chicken",
  cookTime: "45 min",
  ingredients: [
    { qty: "4", item: "chicken thighs" },
    { qty: "2", item: "lemons" },
    { qty: "3 tbsp", item: "olive oil" },
  ],
  tone: "sunset",
  bordered: false,
};

export function Food7({
  recipe,
  servings,
  cookTime,
  calories,
  ingredients = [],
  tone = "sunset",
  bordered = false,
  className,
}: Food7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <ChefHat
            className={cn("size-5 shrink-0", iconClasses[tone])}
            aria-hidden="true"
          />
          {recipe && (
            <span className="text-sm font-semibold text-card-foreground">
              {recipe}
            </span>
          )}
        </div>
        {(cookTime || calories || servings !== undefined) && (
          <div className="flex items-center gap-3 text-xs tabular-nums text-muted-foreground">
            {cookTime && <span>{cookTime}</span>}
            {calories && <span>{calories}</span>}
            {servings !== undefined && <span>{servings} servings</span>}
          </div>
        )}
        <div className="flex flex-col divide-y divide-border">
          {ingredients.map((item, idx) => (
            <div
              key={idx}
              className="flex items-baseline gap-2 py-1 text-xs"
            >
              <span className="w-16 shrink-0 text-muted-foreground">
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
