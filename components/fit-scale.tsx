"use client";

import { type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface FitScaleProps {
  children: ReactNode;
  /** Breathing room kept inside the box, in px per side */
  padding?: number;
  className?: string;
}

/**
 * Scales its child down (never up) so it fully fits the parent box while
 * keeping its natural proportions. Used for large-surface component previews
 * (cards) inside fixed-aspect grid thumbnails, the same idea as the scaled
 * block previews in the blocks grid.
 */
export function FitScale({ children, padding = 20, className }: FitScaleProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const update = () => {
      const availableWidth = outer.clientWidth - padding * 2;
      const availableHeight = outer.clientHeight - padding * 2;
      const naturalWidth = inner.offsetWidth;
      const naturalHeight = inner.offsetHeight;
      if (availableWidth <= 0 || availableHeight <= 0 || !naturalWidth || !naturalHeight) return;
      setScale(Math.min(1, availableWidth / naturalWidth, availableHeight / naturalHeight));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(outer);
    observer.observe(inner);
    return () => observer.disconnect();
  }, [padding]);

  return (
    <div
      ref={outerRef}
      className={cn(
        "absolute inset-0 flex items-center justify-center overflow-hidden",
        className
      )}
    >
      {/* Fixed measuring width: wide enough for the widest card (max-w-md).
          Hidden until measured so the unscaled demo never flashes. */}
      <div
        ref={innerRef}
        className="flex w-[448px] shrink-0 justify-center transition-opacity duration-200"
        style={{
          transform: scale === null ? undefined : `scale(${scale})`,
          opacity: scale === null ? 0 : 1,
        }}
      >
        {children}
      </div>
    </div>
  );
}
