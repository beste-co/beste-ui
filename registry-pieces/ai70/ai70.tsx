"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface Ai70Props {
  title?: string;
  /** Where the picture is going, e.g. the page and the slot */
  meta?: string;
  tabs?: string[];
  /** Tab open on first render */
  selected?: number;
  prompt?: string;
  rows?: { label: string; value: string }[];
  /** The generated picture */
  image?: string;
  caption?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const ai70Demo: Ai70Props = {
  title: "Media",
  tabs: ["Library", "Upload", "Generate"],
  selected: 2,
  prompt: "A calm treatment room with warm wood and soft morning light",
  rows: [
    { label: "Model", value: "Balanced" },
    { label: "Aspect ratio", value: "16:9, wide" },
  ],
  image: "https://oud.pics/b/beste/oriel-consultation.webp",
  framed: true,
};

export function Ai70({ title, meta, tabs = [], selected = 0, prompt, rows = [], image, caption, framed = true, fill = false, className }: Ai70Props) {
  const [tab, setTab] = useState(selected);

  useEffect(() => setTab(selected), [selected]);

  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-160",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-3.5 rounded-2xl bg-card p-4 text-xs text-card-foreground", !framed && "shadow-lg", fill && "justify-center")}>
          {(title || meta) && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm font-semibold">{title}</span>
              {meta && <span className="text-muted-foreground">{meta}</span>}
            </div>
          )}

          {tabs.length > 0 && (
            <div role="tablist" className="flex gap-1 self-start rounded-lg bg-muted p-0.5">
              {tabs.map((label, index) => (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  aria-selected={index === tab}
                  onClick={() => setTab(index)}
                  className={cn("cursor-pointer rounded-md px-3.5 py-1.5 transition-colors", index === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3.5">
            <div className="flex min-w-0 flex-1 basis-60 flex-col gap-2.5">
              {prompt && <div className="min-h-23 rounded-lg bg-muted px-3 py-2.5 leading-normal">{prompt}</div>}
              {rows.length > 0 && (
                <div className="flex flex-col border-t border-border">
                  {rows.map((row, index) => (
                    <div key={index} className="flex justify-between gap-3 border-b border-border py-2">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className="truncate">{row.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {(image || caption) && (
              <div className="flex min-w-0 flex-1 basis-60 flex-col gap-2">
                {image && <img src={image} alt="" aria-hidden="true" className="aspect-16/10 w-full rounded-lg bg-muted object-cover" />}
                {caption && <span className="text-muted-foreground">{caption}</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
