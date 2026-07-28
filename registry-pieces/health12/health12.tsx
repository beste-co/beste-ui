"use client";

import { cn } from "@/lib/utils";

interface NutritionRow {
  label: string;
  value: string;
  dv?: string;
  indent?: boolean;
  bold?: boolean;
}

interface Health12Props {
  serving?: string;
  servings?: string;
  calories?: string;
  rows?: NutritionRow[];
  className?: string;
}

export const health12Demo: Health12Props = {
  serving: "Serving size 1 cup (240 g)",
  servings: "About 2 servings",
  calories: "280",
  rows: [
    { label: "Total fat", value: "10 g", dv: "13%", bold: true },
    { label: "Saturated fat", value: "2 g", dv: "10%", indent: true },
    { label: "Sodium", value: "420 mg", dv: "18%", bold: true },
    { label: "Total carbs", value: "34 g", dv: "12%", bold: true },
    { label: "Sugars", value: "6 g", indent: true },
    { label: "Protein", value: "16 g", bold: true },
  ],
};

export function Health12({
  serving,
  servings,
  calories,
  rows = [],
  className,
}: Health12Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col rounded-md border-2 border-card-foreground bg-card p-2 font-sans text-card-foreground shadow-sm">
        <span className="text-lg font-bold">Nutrition facts</span>
        <span className="text-xs">{servings}</span>
        <span className="border-b-4 border-card-foreground pb-1 text-xs">
          {serving}
        </span>
        <div className="flex items-center justify-between border-b-4 border-card-foreground py-0.5">
          <div className="flex flex-col">
            <span className="text-xs">Amount per serving</span>
            <span className="text-lg font-bold">Calories</span>
          </div>
          <span className="text-2xl font-bold">{calories}</span>
        </div>
        <div className="border-b border-card-foreground py-0.5 text-right text-xs font-bold">
          % Daily value
        </div>
        <div className="flex flex-col">
          {rows.map((row, idx) => (
            <div
              key={idx}
              className={cn(
                "flex items-center justify-between border-b border-border py-0.5 text-xs",
                row.indent && "pl-3"
              )}
            >
              <span className={cn(row.bold && "font-bold")}>
                {row.label}{" "}
                <span className={cn(!row.bold && "font-semibold")}>
                  {row.value}
                </span>
              </span>
              {row.dv && (
                <span className="font-bold">{row.dv}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
