"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface Editor73Props {
  title?: string;
  tag?: string;
  entranceLabel?: string;
  entrance?: string;
  imageMotionLabel?: string;
  options?: string[];
  selected?: string;
  overrideLabel?: string;
  override?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const editor73Demo: Editor73Props = {
  title: "Motion",
  entranceLabel: "Entrance",
  entrance: "Blur in",
  imageMotionLabel: "Image motion",
  options: ["Scale", "Parallax", "Fade", "Blur"],
  selected: "Parallax",
  framed: true,
};

export function Editor73({
  title,
  tag,
  entranceLabel,
  entrance,
  imageMotionLabel,
  options = [],
  selected,
  overrideLabel,
  override,
  framed = true,
  fill = false,
  className,
}: Editor73Props) {
  const [current, setCurrent] = useState(selected);

  useEffect(() => setCurrent(selected), [selected]);

  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-72",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-2.5 rounded-2xl bg-card p-3.5 text-xs text-card-foreground",
            !framed && "shadow-lg"
          )}
        >
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">{title}</span>
            {tag && <span className="text-muted-foreground">{tag}</span>}
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">{entranceLabel}</span>
            <span className="flex items-center gap-1 rounded-lg px-2.5 py-1 ring-1 ring-border">
              {entrance}
              <ChevronDown className="size-3 text-muted-foreground" aria-hidden="true" />
            </span>
          </div>

          <div className="text-muted-foreground">{imageMotionLabel}</div>
          <div className="grid auto-cols-fr grid-flow-col gap-0.5 rounded-lg bg-muted p-0.5 text-center" role="group">
            {options.map((option) => {
              const on = option === current;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setCurrent(option)}
                  className={cn(
                    "cursor-pointer truncate rounded-md py-1 transition-colors",
                    on ? "bg-card text-card-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {overrideLabel && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">{overrideLabel}</span>
              <span>{override}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
