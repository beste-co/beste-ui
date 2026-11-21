"use client";

import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  label: string;
  done?: boolean;
}

type Surface = "muted" | "card" | "none";

interface Automation27Props {
  tasks?: Task[];
  /** Stretch to the slot it sits in (inside a block) instead of keeping a card-sized box */
  fill?: boolean;
  /** The panel behind the list: soft muted (default), the card color, or none to sit on whatever is underneath */
  surface?: Surface;
  className?: string;
}

export const automation27Demo: Automation27Props = {
  tasks: [{ label: "Home routine learned", done: true }, { label: "Tariff imported", done: true }, { label: "Reading 7-day weather" }],
};

const surfaceClasses: Record<Surface, string> = { muted: "bg-muted", card: "bg-card", none: "" };

export function Automation27({ tasks = [], fill = false, surface = "muted", className }: Automation27Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div className={cn("flex min-h-50 flex-col justify-center gap-2.5 rounded-xl px-7", surfaceClasses[surface], fill ? "size-full" : "h-50 w-full max-w-sm")}>
        {tasks.map((task, index) => (
          <div key={index} className={cn("flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm", surface === "muted" ? "bg-card" : "bg-muted", task.done ? "text-foreground" : "text-muted-foreground")}>
            {task.done ? <Check className="size-4 text-chart-2" /> : <Circle className="size-4" />}
            {task.label}
          </div>
        ))}
      </div>
    </div>
  );
}
