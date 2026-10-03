"use client";

import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface Flashcard {
  front: string;
  status: "new" | "learning" | "review" | "mastered";
}

interface Education27Props {
  deck?: string;
  due?: string;
  cards?: Flashcard[];
  bordered?: boolean;
  className?: string;
}

const statusClasses: Record<Flashcard["status"], { pill: string; label: string }> = {
  new: {
    pill: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
    label: "New",
  },
  learning: {
    pill: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    label: "Learning",
  },
  review: {
    pill: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
    label: "Review",
  },
  mastered: {
    pill: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    label: "Mastered",
  },
};

export const education27Demo: Education27Props = {
  deck: "Spanish vocab",
  due: "12 due today",
  cards: [
    { front: "resolver", status: "review" },
    { front: "compartir", status: "learning" },
    { front: "bienvenida", status: "mastered" },
  ],
  bordered: false,
};

export function Education27({
  deck,
  due,
  cards = [],
  bordered = false,
  className,
}: Education27Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <Brain className="size-4 shrink-0 text-violet-500" aria-hidden="true" />
          <div className="flex min-w-0 flex-1 flex-col">
            {deck && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {deck}
              </span>
            )}
            {due && (
              <span className="truncate text-xs tabular-nums text-muted-foreground">
                {due}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col divide-y divide-border">
          {cards.map((c, idx) => {
            const s = statusClasses[c.status];
            return (
              <div
                key={idx}
                className="flex items-center justify-between py-1.5 text-xs"
              >
                <span className="font-serif text-sm italic text-card-foreground">
                  {c.front}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 font-semibold",
                    s.pill
                  )}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
