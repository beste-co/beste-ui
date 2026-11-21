"use client";

import { cn } from "@/lib/utils";

interface Ai60Row {
  label?: string;
  value?: string;
}

interface Ai60Props {
  prompt?: string;
  /** The generated picture shown under the prompt */
  image?: string;
  rows?: Ai60Row[];
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const ai60Demo: Ai60Props = {
  prompt: "A calm treatment room with linen towels and morning light",
  image: "https://oud.pics/b/beste/oriel-consultation.webp",
  rows: [
    { label: "Model", value: "Flux Pro" },
    { label: "Shape", value: "Landscape, 4:3" },
    { label: "Goes to", value: "Home, hero image" },
  ],
  framed: true,
};

export function Ai60({ prompt, image, rows = [], framed = true, fill = false, className }: Ai60Props) {
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
          {prompt && <div className="rounded-lg bg-muted p-2.5 leading-normal">{prompt}</div>}
          {image && <img src={image} alt={prompt ?? ""} className="aspect-4/3 w-full rounded-lg object-cover" />}
          {rows.length > 0 && (
          <div className="flex flex-col">
            {rows.map((row, i) => (
              <div key={i} className="flex justify-between gap-2 border-t border-border pt-2 not-last:pb-2">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="truncate">{row.value}</span>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
