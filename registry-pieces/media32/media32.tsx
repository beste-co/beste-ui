"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Media32Props {
  title?: string;
  prompt?: string;
  /** Up to four results, revealed in order */
  images?: { src: string; alt?: string }[];
  /** The credits line at the foot */
  credits?: string;
  button?: string;
  /** Let the results reveal one by one on a loop */
  animated?: boolean;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const media32Demo: Media32Props = {
  title: "Generate images",
  prompt: "Orange objects on a white studio floor, soft daylight, lots of space",
  images: [
    { src: "https://oud.pics/b/beste/object-balloon.webp", alt: "An orange balloon" },
    { src: "https://oud.pics/b/beste/object-plane.webp", alt: "An orange paper plane" },
    { src: "https://oud.pics/b/beste/object-keys.webp", alt: "Orange keys" },
    { src: "https://oud.pics/b/beste/object-camera.webp", alt: "An orange camera" },
  ],
  credits: "400 credits used, 14,600 left",
  button: "Use image",
  animated: true,
  framed: true,
};

// Results show at once, then dim and develop again one after another
const STYLES = [
  ...[0, 1, 2, 3].map((index) => {
    const start = 18 + index * 10;
    return `@keyframes media32-tile-${index} { 0%, 8% { opacity: 1; filter: none; transform: none } 12%, ${start}% { opacity: .35; filter: blur(8px) saturate(.4); transform: scale(.97) } ${start + 8}%, 100% { opacity: 1; filter: none; transform: none } }
.media32-tile-${index} { animation: media32-tile-${index} 13s ease infinite }`;
  }),
  "@media (prefers-reduced-motion: reduce) { .media32-tile-0, .media32-tile-1, .media32-tile-2, .media32-tile-3 { animation: none } }",
].join("\n");

export function Media32({ title, prompt, images = [], credits, button, animated = true, framed = true, fill = false, className }: Media32Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      {animated && <style>{STYLES}</style>}
      <div
        className={cn(
          "w-full",
          !fill && "max-w-sm",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-3 rounded-2xl bg-card p-3.5 text-xs text-card-foreground", !framed && "shadow-lg")}>
          <span className="text-sm font-semibold">{title}</span>
          {prompt && (
            <div className="flex items-start gap-2 rounded-xl border border-border px-3 py-2.5 leading-relaxed ring-3 ring-chart-1/15">
              <Sparkles aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-chart-1" />
              <span>{prompt}</span>
            </div>
          )}
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-1.5">
              {images.slice(0, 4).map((image, index) => (
                <div key={index} className="overflow-hidden rounded-lg bg-muted">
                  <img
                    src={image.src}
                    alt={image.alt ?? ""}
                    loading="lazy"
                    decoding="async"
                    className={cn("aspect-square w-full object-cover", animated && `media32-tile-${index}`, index === 0 && "ring-2 ring-primary ring-inset")}
                  />
                </div>
              ))}
            </div>
          )}
          {(credits || button) && (
            <div className="flex items-center justify-between gap-3">
              {credits && <span className="truncate text-muted-foreground">{credits}</span>}
              {button && <span className="shrink-0 rounded-full bg-primary px-3 py-1.5 text-primary-foreground">{button}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
