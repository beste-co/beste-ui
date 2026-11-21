"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface Media29Props {
  /** A header row above the grid */
  title?: string;
  meta?: string;
  tabs?: string[];
  /** Tab open on first render */
  selected?: number;
  images?: string[];
  /** Images per row; two gives wider 4:3 tiles */
  columns?: 2 | 3;
  /** The image picked out with a ring */
  active?: number;
  /** A line at the foot in place of the sort menu, e.g. which file is picked */
  selectedLabel?: string;
  sortLabel?: string;
  countLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const media29Demo: Media29Props = {
  tabs: ["Library", "Generate", "Upload"],
  selected: 0,
  images: [
    "https://oud.pics/b/beste/oriel-studio.webp",
    "https://oud.pics/b/beste/oriel-consultation.webp",
    "https://oud.pics/b/beste/oriel-ritual.webp",
  ],
  framed: true,
};

export function Media29({
  title,
  meta,
  tabs = [],
  selected = 0,
  images = [],
  columns = 3,
  active = 0,
  selectedLabel,
  sortLabel,
  countLabel,
  framed = true,
  fill = false,
  className,
}: Media29Props) {
  const [tab, setTab] = useState(selected);

  useEffect(() => setTab(selected), [selected]);

  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-72",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md",
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-2 rounded-2xl bg-card p-3 text-xs text-card-foreground",
            !framed && "shadow-lg",
          )}
        >
          {(title || meta) && (
            <div className="flex items-center justify-between gap-3 pb-1">
              <span className="text-sm font-semibold">{title}</span>
              {meta && <span className="truncate text-muted-foreground">{meta}</span>}
            </div>
          )}
          {tabs.length > 0 && (
            <div role="tablist" className="grid auto-cols-fr grid-flow-col gap-0.5 rounded-lg bg-muted p-0.5 text-center">
              {tabs.map((label, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === tab}
                  onClick={() => setTab(i)}
                  className={cn(
                    "cursor-pointer rounded-md py-1 transition-colors",
                    i === tab ? "bg-card shadow-sm" : "text-muted-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          <div className={cn("grid gap-1.5", columns === 2 ? "grid-cols-2" : "grid-cols-3")}>
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                aria-hidden
                className={cn("w-full rounded-md object-cover", columns === 2 ? "aspect-4/3" : "aspect-square", i === active && (columns === 2 ? "ring-2 ring-foreground/20 ring-offset-2 ring-offset-card" : "ring-1 ring-foreground/25"))}
              />
            ))}
          </div>
          {(selectedLabel || sortLabel || countLabel) && (
          <div className={cn("flex justify-between gap-2 text-muted-foreground", selectedLabel && "mt-1 border-t border-border pt-2.5")}>
            {selectedLabel ? (
              <span className="truncate">{selectedLabel}</span>
            ) : (
              <span className="flex items-center gap-1">
                {sortLabel}
                <ChevronDown aria-hidden className="size-3" />
              </span>
            )}
            <span>{countLabel}</span>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
