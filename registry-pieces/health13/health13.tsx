"use client";

import { ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "sky"
  | "emerald"
  | "violet"
  | "amber"
  | "rose";

interface Health13Props {
  recipeName?: string;
  cookTime?: string;
  calories?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  tags?: string[];
  tone?: Tone;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  neutral: "bg-muted text-foreground",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  violet: "bg-violet-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
};

const difficultyClasses: Record<"Easy" | "Medium" | "Hard", string> = {
  Easy: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  Medium: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  Hard: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
};

export const health13Demo: Health13Props = {
  recipeName: "Miso salmon with greens",
  cookTime: "25 min",
  calories: "520 kcal",
  difficulty: "Easy",
  tags: ["Dinner", "High-protein", "Gluten-free"],
  tone: "neutral",
};

export function Health13({
  recipeName,
  cookTime,
  calories,
  difficulty = "Easy",
  tags = [],
  tone = "rose",
  className,
}: Health13Props) {
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
              "flex size-9 items-center justify-center rounded-md",
              iconClasses[tone]
            )}
          >
            <ChefHat className="size-4" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {recipeName && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {recipeName}
              </span>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {cookTime && <span>{cookTime}</span>}
              {cookTime && calories && <span>·</span>}
              {calories && <span>{calories}</span>}
            </div>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold",
              difficultyClasses[difficulty]
            )}
          >
            {difficulty}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
