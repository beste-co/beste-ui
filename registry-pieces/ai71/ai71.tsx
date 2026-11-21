"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

import { cn } from "@/lib/utils";

type Tone = "success" | "neutral";

interface Ai71Model {
  name: string;
  /** A small pill on the right, e.g. which plan includes it */
  tag?: string;
  /** Green for included, stone for an upgrade */
  tone?: Tone;
  /** Shown with a lock and not selectable */
  locked?: boolean;
}

interface Ai71Props {
  title?: string;
  meta?: string;
  models?: Ai71Model[];
  /** Model picked on first render */
  defaultModel?: number;
  ratioTitle?: string;
  ratioMeta?: string;
  ratios?: string[];
  /** Ratio picked on first render */
  defaultRatio?: number;
  /** A quiet line with a dot at the foot */
  note?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  neutral: "bg-muted text-muted-foreground",
};

export const ai71Demo: Ai71Props = {
  title: "Model",
  models: [
    { name: "Fast", tag: "On Free", tone: "success" },
    { name: "Balanced", tag: "On Free", tone: "success" },
    { name: "Highest quality", tag: "Paid plan", tone: "neutral", locked: true },
  ],
  defaultModel: 1,
  ratioTitle: "Aspect ratio",
  ratios: ["16:9", "4:3", "1:1", "3:4"],
  defaultRatio: 0,
  framed: true,
};

export function Ai71({ title, meta, models = [], defaultModel = 0, ratioTitle, ratioMeta, ratios = [], defaultRatio = 0, note, framed = true, fill = false, className }: Ai71Props) {
  const [model, setModel] = useState(defaultModel);
  const [ratio, setRatio] = useState(defaultRatio);

  useEffect(() => setModel(defaultModel), [defaultModel]);
  useEffect(() => setRatio(defaultRatio), [defaultRatio]);

  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-95",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-3 rounded-2xl bg-card p-4 text-xs text-card-foreground", !framed && "shadow-lg", fill && "justify-center")}>
          {(title || meta) && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold">{title}</span>
              {meta && <span className="text-muted-foreground">{meta}</span>}
            </div>
          )}

          {models.length > 0 && (
            <div role="radiogroup" aria-label={title} className="flex flex-col gap-1.5">
              {models.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  role="radio"
                  aria-checked={index === model}
                  disabled={item.locked}
                  onClick={() => setModel(index)}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-lg px-2.5 py-2.5 text-left ring-1 transition-colors",
                    item.locked ? "cursor-not-allowed text-muted-foreground ring-border" : "cursor-pointer",
                    !item.locked && (index === model ? "bg-muted ring-foreground/25" : "ring-border hover:bg-muted"),
                  )}
                >
                  <span className="flex min-w-0 items-center gap-1.5">
                    {item.locked && <Lock aria-hidden="true" className="size-3 shrink-0" />}
                    <span className="truncate">{item.name}</span>
                  </span>
                  {item.tag && <span className={cn("shrink-0 rounded-full px-2 py-0.5", toneClasses[item.tone ?? "neutral"])}>{item.tag}</span>}
                </button>
              ))}
            </div>
          )}

          {(ratioTitle || ratioMeta) && (
            <div className="mt-1 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold">{ratioTitle}</span>
              {ratioMeta && <span className="text-muted-foreground">{ratioMeta}</span>}
            </div>
          )}

          {ratios.length > 0 && (
            <div role="radiogroup" aria-label={ratioTitle} className="flex flex-wrap gap-1.5">
              {ratios.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  role="radio"
                  aria-checked={index === ratio}
                  onClick={() => setRatio(index)}
                  className={cn(
                    "cursor-pointer rounded-full px-3 py-1 ring-1 transition-colors",
                    index === ratio ? "bg-muted text-foreground ring-foreground/25" : "text-foreground/70 ring-border hover:text-foreground",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          )}

          {note && (
            <div className="flex items-center gap-1.5 border-t border-border pt-2.5 text-muted-foreground">
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
              <span className="truncate">{note}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
