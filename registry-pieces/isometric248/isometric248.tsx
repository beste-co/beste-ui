"use client";

import { type ReactNode, useId } from "react";
import { cn } from "@/lib/utils";

// --- isometric kit (shared by every Isometric piece, keep in sync) ---
type Tone = "primary" | "foreground" | "color" | "none";
type Palette = "theme" | "light" | "dark" | "tone";

// "color" takes the `color` prop instead of a class, so any hex works
const toneClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  color: "",
  none: "text-foreground",
};
const DEFAULT_COLOR = "#2F6FED";
/** Whether a hex color is light enough that dark lines read better on it. */
function isLight(hex: string) {
  const digits = hex.replace("#", "");
  const full = digits.length === 3 ? digits.replace(/./g, "$&$&") : digits;
  const value = Number.parseInt(full, 16);
  if (full.length !== 6 || Number.isNaN(value)) return false;
  return 0.2126 * (value >> 16) + 0.7152 * ((value >> 8) & 255) + 0.0722 * (value & 255) > 165;
}

// Isometric projection: x runs down-right, y down-left, z straight up
const C = 0.866;
const S = 0.5;
type Point = [number, number, number];
const project = ([x, y, z]: Point) => `${((x - y) * C).toFixed(1)},${((x + y) * S - z).toFixed(1)}`;
const polygon = (points: Point[]) => points.map(project).join(" ");

/** The three faces a box shows from this angle. */
function box(x: number, y: number, z: number, w: number, d: number, h: number) {
  return {
    top: polygon([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]]),
    left: polygon([[x, y + d, z + h], [x + w, y + d, z + h], [x + w, y + d, z], [x, y + d, z]]),
    right: polygon([[x + w, y, z + h], [x + w, y + d, z + h], [x + w, y + d, z], [x + w, y, z]]),
  };
}
type Faces = ReturnType<typeof box>;

/** Draw flat onto a top face at height z, in plan (x, y) units. */
const onTop = (z: number) => `matrix(${C} ${S} ${-C} ${S} 0 ${-z})`;
/** Draw flat onto the left face lying in the plane y = y0, in (x, -z) units. */
const onLeft = (y0: number) => `matrix(${C} ${S} 0 1 ${(-y0 * C).toFixed(1)} ${(y0 * S).toFixed(1)})`;
/** Draw flat onto the right face lying in the plane x = x0, in (y, -z) units. */
const onRight = (x0: number) => `matrix(${-C} ${S} 0 1 ${(x0 * C).toFixed(1)} ${(x0 * S).toFixed(1)})`;

/** How a solid is painted: a base fill, darker overlays on the two sides, an edge, and ink for details. */
interface Paint {
  base: string;
  left: string;
  right: string;
  edge: string;
  ink: string;
}

const BODY: Record<Palette, Paint> = {
  theme: { base: "fill-card", left: "fill-foreground/5", right: "fill-foreground/10", edge: "stroke-border dark:stroke-foreground/25", ink: "fill-foreground/15" },
  light: { base: "fill-white", left: "fill-zinc-950/5", right: "fill-zinc-950/10", edge: "stroke-zinc-200", ink: "fill-zinc-950/15" },
  dark: { base: "fill-zinc-800", left: "fill-black/20", right: "fill-black/40", edge: "stroke-zinc-500", ink: "fill-white/15" },
  tone: { base: "fill-current", left: "fill-black/15", right: "fill-black/30", edge: "stroke-zinc-400/70", ink: "fill-white/30" },
};
const ACCENT: Paint = { base: "fill-current", left: "fill-black/15", right: "fill-black/30", edge: "stroke-transparent", ink: "fill-white/40" };
// On a body that is already the tone, the accent turns white so it still stands out
const ACCENT_ON_TONE: Paint = { base: "fill-white", left: "fill-black/10", right: "fill-black/20", edge: "stroke-transparent", ink: "fill-current" };

// On a body in the tone, the edge takes whatever stands out against that tone
const TONE_EDGE: Record<Tone, string> = {
  primary: "stroke-primary-foreground/50",
  foreground: "stroke-background/50",
  color: "stroke-white/60",
  none: "stroke-border",
};

/** Body and accent paints; with accent off the piece is one color throughout. */
function paints(palette: Palette, accent: boolean, tone: Tone = "primary", color: string = DEFAULT_COLOR) {
  // A light custom color gets dark lines and ink, a deep one gets light ones
  const onTone = tone === "color" && isLight(color) ? { edge: "stroke-black/35", ink: "fill-black/20" } : { edge: TONE_EDGE[tone] };
  const body = palette === "tone" ? { ...BODY.tone, ...onTone } : BODY[palette];
  return { body, accent: !accent ? body : palette === "tone" ? ACCENT_ON_TONE : ACCENT };
}

function Block({ faces, paint }: { faces: Faces; paint: Paint }) {
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <polygon points={faces.left} className={paint.base} />
      <polygon points={faces.left} className={paint.left} stroke="none" />
      <polygon points={faces.right} className={paint.base} />
      <polygon points={faces.right} className={paint.right} stroke="none" />
      <polygon points={faces.top} className={paint.base} />
    </g>
  );
}
// --- end isometric kit ---

interface Isometric248Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the picked snapshot's tab and the page buttons with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric248Demo: Isometric248Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

type Round = ReturnType<typeof roundBox>;

/** A box with rounded corners in plan; with w = d = 2r it is a cylinder. */
function roundBox(x: number, y: number, z: number, w: number, d: number, h: number, r: number) {
  const corners: [number, number, number][] = [
    [x + w - r, y + r, -90],
    [x + w - r, y + d - r, 0],
    [x + r, y + d - r, 90],
  ];
  // Rim points whose outward normal lies between two angles (degrees, 0 = +x, 90 = +y)
  const rim = (from: number, to: number) => {
    const points: [number, number][] = [];
    for (const [cx, cy, start] of corners) {
      const lo = Math.max(start, from);
      const hi = Math.min(start + 90, to);
      if (lo > hi) continue;
      for (let k = 0; k <= 8; k++) {
        const angle = ((lo + ((hi - lo) * k) / 8) * Math.PI) / 180;
        points.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
      }
    }
    return points;
  };
  const band = (points: [number, number][]) =>
    polygon([...points.map(([px, py]): Point => [px, py, z]), ...points.reverse().map(([px, py]): Point => [px, py, z + h])]);
  return { side: band(rim(-45, 135)), left: band(rim(45, 135)), right: band(rim(-45, 45)), top: { x, y, w, d, r, z: z + h } };
}

function RoundBlock({ shape, paint }: { shape: Round; paint: Paint }) {
  const { top } = shape;
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <polygon points={shape.side} className={paint.base} />
      <polygon points={shape.left} className={paint.left} stroke="none" />
      <polygon points={shape.right} className={paint.right} stroke="none" />
      <rect x={top.x} y={top.y} width={top.w} height={top.d} rx={top.r} transform={onTop(top.z)} vectorEffect="non-scaling-stroke" className={paint.base} />
    </g>
  );
}

/** A page slab standing in the plane y = y0 and facing left; children draw on its face from the top left corner. */
function Slab({ x, y0, z, w, h, t = 4, paint, children }: { x: number; y0: number; z: number; w: number; h: number; t?: number; paint: Paint; children?: ReactNode }) {
  return (
    <g>
      <Block faces={box(x, y0 - t, z, w, t, h)} paint={paint} />
      <g transform={`${onLeft(y0)} translate(${x} ${-(z + h)})`}>{children}</g>
    </g>
  );
}

const BASE = 6;
const SLAB = { x: 30, w: 52, h: 52, z: BASE + 3 };
// Back to front; the last one is the current page
const ROWS = [28, 40, 52, 64, 76];
const PICK = 1;
const FRONT = ROWS[ROWS.length - 1] ?? 76;
const PICKED = ROWS[PICK] ?? 40;
// How far the picked snapshot comes up out of the row
const RISE = 16;
const PERIOD = 10;
// Everything above the picked slab's foot on the tray, so the part still in the row stays hidden
const EMERGE = polygon([
  [SLAB.x, PICKED, SLAB.z],
  [SLAB.x + SLAB.w, PICKED, SLAB.z],
  [SLAB.x + SLAB.w, PICKED - 4, SLAB.z],
  [SLAB.x + SLAB.w, PICKED - 4, SLAB.z + 200],
  [SLAB.x, PICKED, SLAB.z + 200],
]);

const STYLES = `
@keyframes isometric248-rise { 0%, 10%, 90%, 100% { transform: translateY(0px); } 24%, 76% { transform: translateY(${-RISE}px); } }
@keyframes isometric248-tab { 0%, 16% { opacity: 0; } 26%, 74% { opacity: 1; } 84%, 100% { opacity: 0; } }
@keyframes isometric248-old { 0%, 28% { opacity: 0; } 38%, 64% { opacity: 1; } 74%, 100% { opacity: 0; } }
.isometric248-rise { animation: isometric248-rise ${PERIOD}s ease-in-out infinite; }
.isometric248-tab { animation: isometric248-tab ${PERIOD}s ease-in-out infinite; }
.isometric248-old { animation: isometric248-old ${PERIOD}s ease-in-out infinite; }
.isometric248-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric248-scene * { animation: none !important; } }
`;

/** The page frame every snapshot shares: a sheet with a title bar. */
function Sheet({ body, tab }: { body: Paint; tab: string }) {
  return (
    <g>
      <rect x={2} y={2} width={SLAB.w - 4} height={SLAB.h - 4} rx={2} className={body.base} />
      <rect x={5} y={4.2} width={14} height={2.8} rx={1.4} className={tab} />
      <rect x={SLAB.w - 13} y={4.4} width={8} height={2.4} rx={1.2} className={body.ink} />
    </g>
  );
}

export function Isometric248({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric248Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  const clipId = useId();

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric248-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-98 -58 203 174" aria-hidden="true" className="isometric248-scene size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <polygon points={EMERGE} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 112, 104, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(22, 14, BASE, 68, 70, 3, 8)} paint={body} />
        {/* The snapshots, back to front; the picked one comes up out of the row and its tab takes the tone */}
        {ROWS.slice(0, -1).map((y0, index) =>
          index === PICK ? (
            <g key={`snapshot-${y0}`} clipPath={`url(#${clipId})`}>
              <g className="isometric248-rise">
                <Slab x={SLAB.x} y0={y0} z={SLAB.z - RISE} w={SLAB.w} h={SLAB.h + RISE} paint={body}>
                  <Sheet body={body} tab={body.ink} />
                  <rect x={5} y={4.2} width={14} height={2.8} rx={1.4} className={cn("isometric248-tab opacity-0", accent ? mine.base : body.ink)} />
                </Slab>
              </g>
            </g>
          ) : (
            <Slab key={`snapshot-${y0}`} x={SLAB.x} y0={y0} z={SLAB.z} w={SLAB.w} h={SLAB.h} paint={body}>
              <Sheet body={body} tab={body.ink} />
            </Slab>
          ),
        )}
        {/* The current page in front, and the older content that fades in over it */}
        <Slab x={SLAB.x} y0={FRONT} z={SLAB.z} w={SLAB.w} h={SLAB.h} paint={body}>
          <Sheet body={body} tab={body.ink} />
          <rect x={5} y={11} width={30} height={3.4} rx={1.7} className={body.ink} />
          <rect x={5} y={17} width={21} height={2.4} rx={1.2} className={body.ink} />
          <rect x={5} y={23} width={17} height={6.5} rx={3.25} className={accent ? mine.base : body.ink} />
          <rect x={5} y={34} width={20} height={13} rx={2} className={body.ink} />
          <rect x={27} y={34} width={20} height={13} rx={2} className={body.ink} />
          <g className="isometric248-old opacity-0">
            <rect x={2} y={9} width={SLAB.w - 4} height={SLAB.h - 11} className={body.base} />
            <rect x={5} y={4.2} width={14} height={2.8} rx={1.4} className={accent ? mine.base : body.ink} />
            <rect x={5} y={11} width={19} height={25} rx={2} className={body.ink} />
            <circle cx={11.5} cy={18} r={3} className={body.base} />
            <rect x={27} y={12} width={20} height={3.4} rx={1.7} className={body.ink} />
            <rect x={27} y={18.5} width={15} height={2.4} rx={1.2} className={body.ink} />
            <rect x={27} y={23.5} width={18} height={2.4} rx={1.2} className={body.ink} />
            <rect x={27} y={30} width={13} height={6} rx={3} className={body.ink} />
            <rect x={5} y={40} width={42} height={7} rx={2} className={body.ink} />
          </g>
        </Slab>
      </svg>
    </div>
  );
}
