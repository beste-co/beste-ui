"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Position = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export interface StageStackProps {
  /** The centered piece the rest leans on, e.g. a device frame */
  main: ReactNode;
  /** Smaller pieces overlapping the main one's corners */
  satellites?: { node: ReactNode; position: Position; /** A CSS width, a share of the main piece by default */ width?: string }[];
  /** Satellites drift slowly */
  float?: boolean;
  /** The group leans toward the pointer */
  tilt?: boolean;
  className?: string;
}

// Corners sit partly outside the main piece on wide screens and tuck in on phones
const positionStyles: Record<Position, string> = {
  "top-left": "top-0 left-0 origin-top-left max-sm:scale-75 sm:-translate-x-[12%] sm:-translate-y-[22%]",
  "top-right": "top-0 right-0 origin-top-right max-sm:scale-75 sm:translate-x-[12%] sm:-translate-y-[22%]",
  "bottom-left": "bottom-0 left-0 origin-bottom-left max-sm:scale-75 sm:-translate-x-[12%] sm:translate-y-[22%]",
  "bottom-right": "right-0 bottom-0 origin-bottom-right max-sm:scale-75 sm:translate-x-[12%] sm:translate-y-[22%]",
};

const STYLES = `
@keyframes stage-stack-float { 0%, 100% { transform: translate3d(0, 0, 0) } 50% { transform: translate3d(0, -8px, 0) } }
.stage-stack-float { animation: stage-stack-float 7s ease-in-out infinite }
@media (prefers-reduced-motion: reduce) { .stage-stack-float { animation: none } }
`;

export const stageStackDemo: StageStackProps = {
  main: <div className="aspect-video w-full rounded-2xl border border-border bg-card shadow-xl" />,
  satellites: [
    { node: <div className="h-24 rounded-2xl border border-border bg-card shadow-lg" />, position: "top-right" },
    { node: <div className="h-20 rounded-2xl border border-border bg-card shadow-lg" />, position: "bottom-left" },
  ],
  float: true,
  tilt: true,
  className: "mx-auto w-full max-w-xl",
};

export function StageStack({ main, satellites = [], float = true, tilt = false, className }: StageStackProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const group = groupRef.current;
    if (!tilt || !root || !group) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.matchMedia("(pointer: coarse)").matches) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;

    const step = () => {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      group.style.transform = `rotateX(${(-current.y * 5).toFixed(3)}deg) rotateY(${(current.x * 7).toFixed(3)}deg)`;
      const settled = Math.abs(target.x - current.x) < 0.001 && Math.abs(target.y - current.y) < 0.001;
      frame = settled ? 0 : requestAnimationFrame(step);
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(step);
    };
    const onMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      target.x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
      target.y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
      kick();
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      kick();
    };

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, [tilt]);

  return (
    <div ref={rootRef} className={cn("relative perspective-[1600px]", className)}>
      {float && satellites.length > 0 && <style>{STYLES}</style>}
      <div ref={groupRef} className="relative transform-3d">
        <div className="relative">{main}</div>
        {satellites.map((satellite, index) => (
          <div
            key={index}
            style={{ width: satellite.width ?? "38%", transform: tilt ? "translateZ(48px)" : undefined }}
            className={cn("absolute z-10", positionStyles[satellite.position])}
          >
            {/* Each satellite drifts on its own phase */}
            <div className={cn(float && "stage-stack-float")} style={float ? { animationDelay: `${index * -2.3}s` } : undefined}>
              {satellite.node}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
