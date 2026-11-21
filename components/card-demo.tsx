"use client";

import { type ComponentType, type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { FitScale } from "@/components/fit-scale";
import { BACKGROUND_PREVIEW_CATEGORIES, FRAME_PREVIEW_CATEGORIES } from "@/lib/registry-component-preview";
import { cn } from "@/lib/utils";

const MIN_SCALE = 0.2;
const MAX_SCALE = 2;
// Clear space every demo keeps from the card's edge, in card pixels
const CARD_PADDING = 20;
// A fluid demo is measured on a canvas this wide for the width it was built for
const WIDE_CANVAS = 1200;
// How far below that width a demo may squeeze before the card scales it down instead
const SQUEEZE = 0.75;
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
 * call; without one the demo is measured: first on a wide canvas for the width it
 * wants, so a fluid demo is scaled down instead of squeezed, then for overflow.
 */
export function CardFit({ scale, padding = CARD_PADDING, children }: { scale?: number; padding?: number; children: ReactNode }) {
  const fixed = clampCardScale(scale);
  const outerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  // Scale from the width the demo wants, then the final scale once overflow is checked
  const [base, setBase] = useState<number | null>(fixed ?? null);
  const [fit, setFit] = useState<number | null>(fixed ?? null);
  const [pass, setPass] = useState(0);

  // Each step measures an untransformed canvas: `base` and `fit` start over together
  // biome-ignore lint/correctness/useExhaustiveDependencies: `pass` re-runs the measurement.
  useLayoutEffect(() => {
    if (fixed || fit !== null) return;
    const outer = outerRef.current;
    const canvas = canvasRef.current;
    if (!outer || !canvas) return;
    const box = outer.getBoundingClientRect();
    if (!box.width || !box.height) return;
    // What is left of the card once the padding is taken off both sides
    const room = { width: box.width - padding * 2, height: box.height - padding * 2 };
    if (room.width <= 0 || room.height <= 0) return;

    if (base === null) {
      // The demo's own surface sits one level in, under a full-size root. A surface that
      // fills its parent all the way has no width of its own, so the demo keeps the card's
      let wanted = 0;
      let open = true;
      for (const root of Array.from(canvas.children)) {
        const style = getComputedStyle(root);
        const inner = root.clientWidth - Number.parseFloat(style.paddingLeft) - Number.parseFloat(style.paddingRight);
        for (const child of Array.from(root.children)) {
          const width = child.getBoundingClientRect().width;
          if (!width) continue;
          wanted = Math.max(wanted, width);
          if (width < inner - 1) open = false;
        }
      }
      if (!wanted) open = true;
      const layout = open ? room.width : Math.max(room.width, wanted * SQUEEZE);
      setBase(Math.max(MIN_SCALE, Math.min(1, room.width / layout)));
      return;
    }

    const layoutRoom = { width: room.width / base, height: room.height / base };
    let width = canvas.scrollWidth - (padding / base) * 2;
    let height = canvas.scrollHeight - (padding / base) * 2;
    for (const child of Array.from(canvas.children)) {
      const rect = child.getBoundingClientRect();
      width = Math.max(width, rect.width);
      height = Math.max(height, rect.height);
    }
    const needed = Math.max(width / layoutRoom.width, height / layoutRoom.height);
    setFit(Math.max(MIN_SCALE, needed > 1.01 ? base / needed : base));
  }, [fixed, base, fit, pass, padding]);

  // A card that changes size is measured again from the start, also one that had no height yet
  useLayoutEffect(() => {
    if (fixed) return;
    const outer = outerRef.current;
    if (!outer) return;
    let last = `${outer.clientWidth}x${outer.clientHeight}`;
    const observer = new ResizeObserver(() => {
      const size = `${outer.clientWidth}x${outer.clientHeight}`;
      if (size === last) return;
      last = size;
      setBase(null);
      setFit(null);
      setPass((value) => value + 1);
    });
    observer.observe(outer);
    return () => observer.disconnect();
  }, [fixed]);

  const measuring = !fixed && fit === null;
  // While measuring nothing is scaled: first a wide canvas, then the canvas at `base`
  const layout = fixed ?? fit ?? base ?? 1;
  const shown = measuring ? 1 : layout;
  const width = measuring && base === null ? `max(100%, ${WIDE_CANVAS}px)` : `${100 / layout}%`;
  return (
    <div ref={outerRef} className="absolute inset-0 overflow-hidden">
      <div
        ref={canvasRef}
        className="absolute left-1/2 top-1/2 flex items-center justify-center"
        style={{
          width,
          height: `${100 / layout}%`,
          transform: `translate(-50%, -50%) scale(${shown})`,
          // Divided by the scale, so the gap reads the same on every card
          padding: padding / layout,
          opacity: measuring ? 0 : 1,
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
export function CardDemo({ entry, kind = "component" }: { entry: CardDemoEntry; kind?: "piece" | "component" }) {
  const Component = entry.component;
  const props = (entry.demoProps ?? {}) as Record<string, unknown>;

  if (entry.fullBleed || BACKGROUND_PREVIEW_CATEGORIES.has(entry.category ?? "")) {
    const given = typeof props.className === "string" ? props.className : undefined;
    return <Component {...props} className={cn(given, "absolute inset-0 h-full min-h-0")} />;
  }

  // Large component surfaces keep their own fit unless the meta asks for a size.
  // Pieces share category names (Dashboard, Card) but are card-sized already.
  if (kind === "component" && !entry.cardScale && FRAME_PREVIEW_CATEGORIES.has(entry.category ?? "")) {
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
