"use client";

import type { ReactNode } from "react";
import { useId } from "react";
import { cn } from "@/lib/utils";

interface Text18Props {
  /** The line that runs around the circle; end it with a separator so the loop reads cleanly */
  text: string;
  /** Diameter in pixels */
  size?: number;
  /** Seconds for one full turn; 0 keeps it still */
  duration?: number;
  /** Turn clockwise (default) or counter-clockwise */
  direction?: "clockwise" | "counter";
  /** Something to sit in the middle, e.g. an icon or a short word */
  children?: ReactNode;
  className?: string;
}

export const text18Demo: Text18Props = {
  text: "Altair · Lisbon · since 2019 · ",
  size: 180,
  className: "text-sm uppercase tracking-[0.3em] text-foreground",
  children: <span className="font-serif text-3xl">A</span>,
};

export function Text18({ text, size = 200, duration = 24, direction = "clockwise", children, className }: Text18Props) {
  const id = useId().replace(/:/g, "");
  const pathId = `text18-path-${id}`;
  const spinId = `text18-spin-${id}`;
  const radius = 42;

  return (
    <span className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }} aria-label={text}>
      <style>{`@keyframes ${spinId}{to{transform:rotate(${direction === "clockwise" ? 360 : -360}deg)}}`}</style>
      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="absolute inset-0 size-full motion-reduce:animate-none"
        style={duration > 0 ? { animation: `${spinId} ${duration}s linear infinite` } : undefined}
      >
        <defs>
          <path id={pathId} d={`M 50,50 m -${radius},0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`} />
        </defs>
        <text fill="currentColor" fontSize="11" style={{ letterSpacing: "inherit", textTransform: "inherit", fontFamily: "inherit" }}>
          <textPath href={`#${pathId}`}>{text}</textPath>
        </text>
      </svg>
      {children && <span className="relative">{children}</span>}
    </span>
  );
}
