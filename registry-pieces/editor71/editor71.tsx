"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

type LayoutKind = "split" | "centered" | "full" | "stats";

interface Editor71Layout {
  label: string;
  kind: LayoutKind;
  image?: string;
}

interface Editor71Props {
  title?: string;
  tag?: string;
  searchPlaceholder?: string;
  categories?: string[];
  activeCategory?: string;
  layouts?: Editor71Layout[];
  /** Label of the layout drawn as picked */
  selected?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const editor71Demo: Editor71Props = {
  title: "Add a section",
  categories: ["Heroes", "Features", "Pricing"],
  activeCategory: "Heroes",
  layouts: [
    { label: "Split hero", kind: "split", image: "https://oud.pics/b/beste/oriel-studio.webp" },
    { label: "Centered hero", kind: "centered" },
    { label: "Full-width photo", kind: "full", image: "https://oud.pics/b/beste/oriel-consultation.webp" },
    { label: "Hero with stats", kind: "stats", image: "https://oud.pics/b/beste/oriel-serum.webp" },
  ],
  selected: "Split hero",
  framed: true,
};

function Thumb({ kind, image }: { kind: LayoutKind; image?: string }) {
  if (kind === "full") {
    return (
      <span className="relative block h-14 overflow-hidden rounded-sm bg-stone-200" aria-hidden="true">
        {image && <img src={image} alt="" className="size-full object-cover" />}
        <span className="absolute bottom-2 left-2 h-1 w-1/2 rounded-full bg-white/90" />
      </span>
    );
  }
  if (kind === "centered") {
    return (
      <span className="flex h-14 flex-col items-center justify-end gap-1" aria-hidden="true">
        <span className="h-1 w-3/4 rounded-full bg-stone-300" />
        <span className="h-1 w-1/2 rounded-full bg-stone-200" />
        <span className="mt-0.5 h-2 w-7.5 rounded-full bg-stone-800" />
        <span className="h-3.5 w-full rounded-sm bg-stone-200" />
      </span>
    );
  }
  if (kind === "stats") {
    return (
      <span className="flex h-14 items-center gap-1.5" aria-hidden="true">
        {image ? (
          <img src={image} alt="" className="h-full w-2/5 shrink-0 rounded-sm object-cover" />
        ) : (
          <span className="h-full w-2/5 shrink-0 rounded-sm bg-stone-200" />
        )}
        <span className="flex flex-1 flex-col gap-1">
          <span className="h-1 w-5/6 rounded-full bg-stone-300" />
          <span className="h-1 w-2/3 rounded-full bg-stone-200" />
          <span className="h-1 w-1/2 rounded-full bg-stone-200" />
        </span>
      </span>
    );
  }
  return (
    <span className="flex h-14 items-center gap-1.5" aria-hidden="true">
      <span className="flex flex-1 flex-col gap-1">
        <span className="h-1 w-11/12 rounded-full bg-stone-300" />
        <span className="h-1 w-3/5 rounded-full bg-stone-300" />
        <span className="h-1 w-3/4 rounded-full bg-stone-200" />
      </span>
      {image ? (
        <img src={image} alt="" className="h-11 w-1/2 shrink-0 rounded-sm object-cover" />
      ) : (
        <span className="h-11 w-1/2 shrink-0 rounded-sm bg-stone-200" />
      )}
    </span>
  );
}

export function Editor71({
  title,
  tag,
  searchPlaceholder,
  categories = [],
  activeCategory,
  layouts = [],
  selected,
  framed = true,
  fill = false,
  className,
}: Editor71Props) {
  const [active, setActive] = useState(activeCategory);

  useEffect(() => setActive(activeCategory), [activeCategory]);

  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-100",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-3 rounded-2xl bg-card p-3.5 text-xs text-card-foreground",
            !framed && "shadow-lg"
          )}
        >
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">{title}</span>
            {tag && <span className="text-muted-foreground">{tag}</span>}
          </div>

          {searchPlaceholder && (
            <div className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-muted-foreground ring-1 ring-border">
              <Search className="size-3 shrink-0" aria-hidden="true" />
              <span className="truncate">{searchPlaceholder}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5">
            {categories.map((category) => {
              const on = category === active;
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setActive(category)}
                  className={cn(
                    "cursor-pointer rounded-full px-2.5 py-1 transition-colors",
                    on ? "bg-primary text-primary-foreground" : "text-muted-foreground ring-1 ring-border hover:text-foreground"
                  )}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {layouts.map((layout) => {
              const picked = layout.label === selected;
              return (
                <div
                  key={layout.label}
                  className={cn("flex flex-col rounded-lg p-2 ring-1", picked ? "ring-2 ring-primary" : "ring-border")}
                >
                  <Thumb kind={layout.kind} image={layout.image} />
                  <span className="sr-only">{layout.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
