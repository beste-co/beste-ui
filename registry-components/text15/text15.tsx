"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface Text15Props {
  /** The line that runs; it is repeated so the loop never shows a gap */
  text: string;
  /** Separator printed between repeats */
  separator?: string;
  /** Seconds for one full pass */
  duration?: number;
  /** Run right to left (default) or left to right */
  direction?: "left" | "right";
  /** Pause while hovered */
  pauseOnHover?: boolean;
  className?: string;
}

export const text15Demo: Text15Props = {
  text: "Therapy and coaching, in the room or online",
  separator: "·",
  className: "px-0 text-sm uppercase tracking-[0.25em] text-muted-foreground",
};

export function Text15({ text, separator = "·", duration = 28, direction = "left", pauseOnHover = true, className }: Text15Props) {
  const name = `text15-${useId().replace(/:/g, "")}`;
  const copies = Array.from({ length: 6 });

  return (
    <div
      className={cn("group/text15 relative w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]", className)}
      aria-label={text}
    >
      <style>{`@keyframes ${name}{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      <div
        aria-hidden="true"
        className={cn("flex w-max whitespace-nowrap will-change-transform motion-reduce:animate-none", pauseOnHover && "group-hover/text15:[animation-play-state:paused]")}
        style={{ animation: `${name} ${duration}s linear infinite`, animationDirection: direction === "right" ? "reverse" : "normal" }}
      >
        {[0, 1].map((half) => (
          <span key={half} className="flex shrink-0">
            {copies.map((_, index) => (
              <span key={index} className="flex items-center">
                <span className="px-4">{text}</span>
                <span className="px-2 opacity-50">{separator}</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
