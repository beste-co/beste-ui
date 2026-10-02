"use client";

import { useId } from "react";
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

interface Isometric185Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the buttons, the cart badge and the confirmation with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric185Demo: Isometric185Props = {
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

const BASE = 6;
const W = 64;
const TALL = 118;
const THICK = 6;
// The phone stands on its bottom front edge and leans back by this much
const LEAN = (14 * Math.PI) / 180;
const FOOT = { x: 18, y: 46, z: BASE + 3 };
const UP: Point = [0, -Math.sin(LEAN), Math.cos(LEAN)];
const BACK: Point = [0, -Math.cos(LEAN), -Math.sin(LEAN)];
const flat = ([x, y, z]: Point) => [(x - y) * C, (x + y) * S - z] as const;
/** The matrix that lays local (across, down) units onto the leaning plane `depth` behind the glass, starting `rise` up the phone. */
function plane(depth: number, rise: number, left = 0) {
  const origin: Point = [FOOT.x + left, FOOT.y + UP[1] * rise + BACK[1] * depth, FOOT.z + UP[2] * rise + BACK[2] * depth];
  const [e, f] = flat(origin);
  const [m0, m1] = flat([1, 0, 0]);
  const [m2, m3] = flat([0, -UP[1], -UP[2]]);
  return `matrix(${[m0, m1, m2, m3, e, f].map((n) => n.toFixed(3)).join(" ")})`;
}
const GLASS = plane(0, TALL);
// Behind the glass the body is a stack of thin layers, far to near
const LAYERS = Array.from({ length: THICK }, (_, index) => THICK - index);
// The rest behind the phone: a little wider, half as tall
const REST = { side: 4, tall: 62, depth: 3 };
const REST_LAYERS = Array.from({ length: REST.depth }, (_, index) => THICK + REST.depth - index);

const PERIOD = 10;
// The sheet that slides up over the product page, and the flight of the thumbnail from the product to the cart
const SHEET = { y: 60, h: TALL - 63 };
const HIDE = SHEET.h + 6;
const FLY = { x: 28, y: 43, toX: 22, toY: -29 };
const CHECK = "M-4 0.4L-1.2 3.2L4.4 -3";
const PARCEL = { x: 88, y: 42, w: 10, d: 12, h: 9 };

const STYLES = `
@keyframes isometric185-add { 0%, 12%, 19%, 100% { transform: scale(1); } 15% { transform: scale(0.94); } }
@keyframes isometric185-fly { 0%, 16% { transform: translate(0, 0) scale(1); opacity: 0; } 17% { transform: translate(0, 0) scale(1); opacity: 1; } 24% { transform: translate(${FLY.toX * 0.45}px, ${FLY.toY * 0.85}px) scale(0.8); opacity: 1; } 30% { transform: translate(${FLY.toX}px, ${FLY.toY}px) scale(0.4); opacity: 1; } 31%, 100% { transform: translate(${FLY.toX}px, ${FLY.toY}px) scale(0.4); opacity: 0; } }
@keyframes isometric185-badge { 0%, 29% { transform: scale(0); } 33% { transform: scale(1.25); } 36%, 92% { transform: scale(1); } 98%, 100% { transform: scale(0); } }
@keyframes isometric185-sheet { 0%, 40% { transform: translateY(${HIDE}px); } 50%, 90% { transform: translateY(0); } 98%, 100% { transform: translateY(${HIDE}px); } }
@keyframes isometric185-pay { 0%, 57%, 63%, 100% { transform: scale(1); } 60% { transform: scale(0.95); } }
@keyframes isometric185-done { 0%, 62% { transform: scale(0); } 66% { transform: scale(1.15); } 69%, 100% { transform: scale(1); } }
@keyframes isometric185-check { 0%, 66% { stroke-dashoffset: 14; } 73%, 100% { stroke-dashoffset: 0; } }
@keyframes isometric185-hop { 0%, 66%, 76%, 100% { transform: translateY(0); } 70% { transform: translateY(-5px); } 73.5% { transform: translateY(-1.5px); } }
.isometric185-add { animation: isometric185-add ${PERIOD}s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.isometric185-fly { animation: isometric185-fly ${PERIOD}s cubic-bezier(0.3, 0, 0.3, 1) infinite; transform-box: fill-box; transform-origin: center; }
.isometric185-badge { animation: isometric185-badge ${PERIOD}s ease-out infinite; transform-box: fill-box; transform-origin: center; }
.isometric185-sheet { animation: isometric185-sheet ${PERIOD}s cubic-bezier(0.3, 0, 0.2, 1) infinite; }
.isometric185-pay { animation: isometric185-pay ${PERIOD}s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.isometric185-done { animation: isometric185-done ${PERIOD}s ease-out infinite; transform-box: fill-box; transform-origin: center; }
.isometric185-check { stroke-dasharray: 14; animation: isometric185-check ${PERIOD}s ease-out infinite; }
.isometric185-hop { animation: isometric185-hop ${PERIOD}s ease-out infinite; }
.isometric185-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric185-scene * { animation: none !important; } }
`;

export function Isometric185({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric185Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  // A line drawn on top of an accent fill, and one drawn in the accent on a neutral fill
  const onAccent = accent ? (palette === "tone" ? "stroke-current" : "stroke-white") : body.edge;
  const inAccent = accent ? (palette === "tone" ? "stroke-white" : "stroke-current") : body.edge;
  const parcel = box(PARCEL.x, PARCEL.y, BASE, PARCEL.w, PARCEL.d, PARCEL.h);

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric185-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-70 -116 166 210" aria-hidden="true" className="isometric185-scene size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={3} y={3} width={W - 6} height={TALL - 6} rx={7} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 100, 72, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(FOOT.x - 6, 14, BASE, W + 12, 44, 3, 8)} paint={body} />
        {/* The rest the phone leans against, then the phone itself, each built from thin layers back to front */}
        {REST_LAYERS.map((depth, index) => (
          <g key={depth} transform={plane(depth, REST.tall, -REST.side)} className={body.edge} strokeWidth={index === REST_LAYERS.length - 1 ? 1 : 0}>
            <rect width={W + 2 * REST.side} height={REST.tall} rx={6} className={body.base} />
            <rect width={W + 2 * REST.side} height={REST.tall} rx={6} className={index === REST_LAYERS.length - 1 ? body.left : body.right} stroke="none" />
          </g>
        ))}
        {LAYERS.map((depth) => (
          <g key={depth} transform={plane(depth, TALL)}>
            <rect width={W} height={TALL} rx={9} className={body.base} />
            <rect width={W} height={TALL} rx={9} className={body.right} />
            {depth > 1 && depth < 5 && <rect x={W - 0.5} y={30} width={1.6} height={16} rx={0.8} className={body.ink} />}
          </g>
        ))}
        <g transform={GLASS}>
          <rect width={W} height={TALL} rx={9} strokeWidth={1} className={cn(body.base, body.edge)} />
          <rect x={3} y={3} width={W - 6} height={TALL - 6} rx={7} className={body.ink} />
          <rect x={W / 2 - 8} y={6.5} width={16} height={4} rx={2} className={body.ink} />
          {/* Header: the shop's name and the cart with its badge */}
          <rect x={7} y={17} width={20} height={3.2} rx={1.6} className={body.base} />
          <path d="M45.6 16h2.6l0.5 1.6h8.9l-1.5 5h-6.6l-1.6 -5.2h-2.3Z" className={body.base} />
          <circle cx={50.8} cy={24.2} r={0.9} className={body.base} />
          <circle cx={55} cy={24.2} r={0.9} className={body.base} />
          <circle cx={57.2} cy={15.2} r={3} className={cn("isometric185-badge", accent ? mine.base : body.base)} />
          {/* The product page: picture, title, price, sizes and the add to cart button */}
          <rect x={6} y={30} width={52} height={34} rx={5} className={body.base} />
          <rect x={22} y={38} width={20} height={19} rx={3} className={body.ink} />
          <path d="M27 38v-2.4a5 5 0 0 1 10 0V38" fill="none" strokeWidth={1.4} strokeLinecap="round" className={body.edge} />
          <rect x={6} y={68.5} width={30} height={3.4} rx={1.7} className={body.base} />
          <rect x={6} y={74.5} width={15} height={3.4} rx={1.7} className={accent ? mine.base : body.base} />
          {[0, 1, 2].map((chip) => (
            <rect key={chip} x={6 + chip * 13} y={82} width={11} height={7} rx={3.5} strokeWidth={chip === 1 ? 1.2 : 0} className={cn(body.base, chip === 1 && inAccent)} />
          ))}
          <g className="isometric185-add">
            <rect x={6} y={95} width={52} height={11} rx={5.5} className={accent ? mine.base : body.base} />
            <rect x={22} y={99.2} width={20} height={2.6} rx={1.3} className={accent ? mine.ink : body.ink} />
          </g>
          {/* A thumbnail of the product leaves the picture and lands in the cart */}
          <g className="isometric185-fly opacity-0">
            <rect x={FLY.x} y={FLY.y} width={8} height={8} rx={2} strokeWidth={0.8} className={cn(body.base, body.edge)} />
            <rect x={FLY.x + 2.2} y={FLY.y + 2.6} width={3.6} height={3.4} rx={0.8} className={body.ink} />
          </g>
          {/* The checkout sheet slides up from the bottom of the screen and confirms the order */}
          <g clipPath={`url(#${clipId})`}>
            <g className="isometric185-sheet">
              <rect x={3} y={SHEET.y} width={W - 6} height={SHEET.h + 8} rx={7} strokeWidth={0.9} className={cn(body.base, body.edge)} />
              <rect x={W / 2 - 6} y={SHEET.y + 3} width={12} height={1.6} rx={0.8} className={body.ink} />
              <rect x={8} y={SHEET.y + 9} width={10} height={10} rx={2.5} className={body.ink} />
              <rect x={22} y={SHEET.y + 10.5} width={20} height={2.8} rx={1.4} className={body.ink} />
              <rect x={22} y={SHEET.y + 15.5} width={12} height={2.4} rx={1.2} className={body.ink} />
              <rect x={46} y={SHEET.y + 12.5} width={10} height={3} rx={1.5} className={body.ink} />
              <g className="isometric185-pay">
                <rect x={8} y={SHEET.y + 38} width={W - 16} height={11} rx={5.5} className={accent ? mine.base : body.ink} />
                <rect x={24} y={SHEET.y + 42.2} width={16} height={2.6} rx={1.3} className={accent ? mine.ink : body.base} />
              </g>
              <g transform={`translate(${W / 2} ${SHEET.y + 28})`}>
                <g className="isometric185-done">
                  <circle r={6.5} className={accent ? mine.base : body.ink} />
                  <path d={CHECK} fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={cn("isometric185-check", onAccent)} />
                </g>
              </g>
            </g>
          </g>
        </g>
        {/* The lip of the stand holds the bottom edge of the phone */}
        <RoundBlock shape={roundBox(FOOT.x - 4, FOOT.y - 1, BASE + 3, W + 8, 6, 5, 2.5)} paint={body} />
        {/* The parcel on the base hops when the order is confirmed */}
        <g className="isometric185-hop">
          <Block faces={parcel} paint={body} />
          <g transform={onTop(BASE + PARCEL.h)} className={accent ? mine.base : body.ink}>
            <rect x={PARCEL.x + PARCEL.w / 2 - 1.2} y={PARCEL.y} width={2.4} height={PARCEL.d} />
          </g>
          <g transform={onLeft(PARCEL.y + PARCEL.d)} className={accent ? mine.base : body.ink}>
            <rect x={PARCEL.x + PARCEL.w / 2 - 1.2} y={-BASE - PARCEL.h} width={2.4} height={3.6} />
          </g>
        </g>
      </svg>
    </div>
  );
}
