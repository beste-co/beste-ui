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
  bordered?: boolean;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  neutral: "text-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-500",
  emerald: "text-emerald-500",
  violet: "text-violet-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
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
  tone: "neutral",
  bordered: false,
};

export function Health13({
  recipeName,
  cookTime,
  calories,
  difficulty = "Easy",
  tags = [],
  tone = "primary",
  bordered = false,
  className,
}: Health13Props) {
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
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className={cn("rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground", bordered && "border border-border")}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
