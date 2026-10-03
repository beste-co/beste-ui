"use client";

import { cn } from "@/lib/utils";

interface MealDay {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  today?: boolean;
}

interface Health11Props {
  week?: string;
  days?: MealDay[];
  bordered?: boolean;
  className?: string;
}

export const health11Demo: Health11Props = {
  week: "Meal plan · This week",
  days: [
    { day: "Mon", breakfast: "Oats", lunch: "Bowl", dinner: "Salmon" },
    { day: "Tue", breakfast: "Yogurt", lunch: "Wrap", dinner: "Chili" },
    {
      day: "Wed",
      breakfast: "Smoothie",
      lunch: "Salad",
      dinner: "Stir-fry",
      today: true,
    },
    { day: "Thu", breakfast: "Eggs", lunch: "Soup", dinner: "Pasta" },
  ],
  bordered: false,
};

export function Health11({
  week,
  days = [],
  bordered = false,
  className,
}: Health11Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        {week && (
          <span className="text-xs font-semibold text-muted-foreground">
            {week}
          </span>
        )}
        <div className="flex flex-col">
          {days.map((d, idx) => (
            <div
              key={idx}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs",
                d.today && "bg-primary/10"
              )}
            >
              <span
                className={cn(
                  "w-10 shrink-0 font-semibold",
                  d.today ? "text-primary" : "text-muted-foreground"
                )}
              >
                {d.day}
              </span>
              <span className="flex-1 truncate text-card-foreground">
                {d.breakfast}
              </span>
              <span className="flex-1 truncate text-card-foreground">
                {d.lunch}
              </span>
              <span className="flex-1 truncate text-card-foreground">
                {d.dinner}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
