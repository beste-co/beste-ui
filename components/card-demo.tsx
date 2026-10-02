"use client";

import { type ComponentType, type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { FitScale } from "@/components/fit-scale";
import { BACKGROUND_PREVIEW_CATEGORIES, FRAME_PREVIEW_CATEGORIES } from "@/lib/registry-component-preview";
import { cn } from "@/lib/utils";

const MIN_SCALE = 0.2;
const MAX_SCALE = 2;
// Clear space every demo keeps from the card's edge, in card pixels
const CARD_PADDING = 20;
// Card art draws its own margin, so it runs to the card's edge
const EDGE_TO_EDGE_CATEGORIES: ReadonlySet<string> = new Set(["Isometric"]);

/** `cardScale` from a meta file, held to the range a card can show. */
export function clampCardScale(scale: number | undefined): number | undefined {
  if (!scale || !Number.isFinite(scale)) return undefined;
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
}

/**
 * Lays its child out on a canvas the size of the card divided by the scale, then
 * shrinks the canvas back onto the card. With a `scale` the size is the author's
 * call; without one the demo is measured and shrunk only if it does not fit.
 */
export function CardFit({ scale, padding = CARD_PADDING, children }: { scale?: number; padding?: number; children: ReactNode }) {
  const fixed = clampCardScale(scale);
  const outerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<number | null>(fixed ?? null);
  const [pass, setPass] = useState(0);

  // Measured at natural size: `pass` only moves after the canvas is back at 1
  // biome-ignore lint/correctness/useExhaustiveDependencies: `pass` re-runs the measurement.
  useLayoutEffect(() => {
    if (fixed) return;
    const outer = outerRef.current;
    const canvas = canvasRef.current;
    if (!outer || !canvas) return;
    const box = outer.getBoundingClientRect();
    if (!box.width || !box.height) return;
    // What is left of the card once the padding is taken off both sides
    const room = { width: box.width - padding * 2, height: box.height - padding * 2 };
    if (room.width <= 0 || room.height <= 0) return;
    let width = canvas.scrollWidth - padding * 2;
    let height = canvas.scrollHeight - padding * 2;
    for (const child of Array.from(canvas.children)) {
      const rect = child.getBoundingClientRect();
      width = Math.max(width, rect.width);
      height = Math.max(height, rect.height);
    }
    const needed = Math.max(width / room.width, height / room.height);
    setFit(needed > 1.01 ? Math.max(MIN_SCALE, 1 / needed) : 1);
  }, [fixed, pass, padding]);

  // A card that changes width is measured again from natural size
  useLayoutEffect(() => {
    if (fixed) return;
    const outer = outerRef.current;
    if (!outer) return;
    let last = outer.clientWidth;
    const observer = new ResizeObserver(() => {
      if (outer.clientWidth === last) return;
      last = outer.clientWidth;
      setFit(null);
      setPass((value) => value + 1);
    });
    observer.observe(outer);
    return () => observer.disconnect();
  }, [fixed]);

  const shown = fixed ?? fit ?? 1;
  return (
    <div ref={outerRef} className="absolute inset-0 overflow-hidden">
      <div
        ref={canvasRef}
        className="absolute left-1/2 top-1/2 flex items-center justify-center"
        style={{
          width: `${100 / shown}%`,
          height: `${100 / shown}%`,
          transform: `translate(-50%, -50%) scale(${shown})`,
          // Divided by the scale, so the gap reads the same on every card
          padding: padding / shown,
          opacity: fixed || fit !== null ? 1 : 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export interface CardDemoEntry {
  component: ComponentType<any>;
  demoProps?: any;
  category?: string;
  fullBleed?: boolean;
  cardScale?: number;
}

/**
 * The demo inside a listing card, for pieces and components alike. Backgrounds
 * fill the card; everything else is fitted inside the card's padding, at
 * `cardScale` when the meta names one.
 */
export function CardDemo({ entry }: { entry: CardDemoEntry }) {
  const Component = entry.component;
  const props = (entry.demoProps ?? {}) as Record<string, unknown>;

  if (entry.fullBleed || BACKGROUND_PREVIEW_CATEGORIES.has(entry.category ?? "")) {
    const given = typeof props.className === "string" ? props.className : undefined;
    return <Component {...props} className={cn(given, "absolute inset-0 h-full min-h-0")} />;
  }

  // Large surfaces keep their own fit unless the meta asks for a size
  if (!entry.cardScale && FRAME_PREVIEW_CATEGORIES.has(entry.category ?? "")) {
    return (
      <FitScale>
        <Component {...props} />
      </FitScale>
    );
  }

  return (
    <CardFit scale={entry.cardScale} padding={EDGE_TO_EDGE_CATEGORIES.has(entry.category ?? "") ? 0 : undefined}>
      <Component {...props} />
    </CardFit>
  );
}
