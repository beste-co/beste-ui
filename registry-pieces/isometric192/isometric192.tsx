"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

// --- isometric kit (shared by every Isometric piece, keep in sync) ---
type Tone = "primary" | "foreground" | "color" | "none";
type Palette = "theme" | "light" | "dark" | "tone" | "glass";

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
  // See-through body for a piece that sits over a photo or gradient; stacked solids add up to a frosted look
  glass: { base: "fill-card/30", left: "fill-foreground/5", right: "fill-foreground/10", edge: "stroke-card/70", ink: "fill-foreground/20" },
};
const ACCENT: Paint = { base: "fill-current", left: "fill-black/15", right: "fill-black/30", edge: "stroke-transparent", ink: "fill-white/40" };
// On a body that is already the tone, the accent turns white so it still stands out
const ACCENT_ON_TONE: Paint = { base: "fill-white", left: "fill-black/10", right: "fill-black/20", edge: "stroke-transparent", ink: "fill-current" };
// On a glass body the accent is tinted glass too, with a light rim
const ACCENT_ON_GLASS: Paint = { base: "fill-current/45", left: "fill-black/10", right: "fill-black/20", edge: "stroke-white/50", ink: "fill-white/60" };

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
  return { body, accent: !accent ? body : palette === "tone" ? ACCENT_ON_TONE : palette === "glass" ? ACCENT_ON_GLASS : ACCENT };
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

interface Isometric192Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the file, the progress bars and the buttons with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric192Demo: Isometric192Props = {
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
const W = 52;
const TALL = 96;
const THICK = 5;
const TOP = BASE + THICK;
// Two phones lie flat side by side, tops away from the viewer
const PHONES = [
  { id: "a", x: 8, y: 8 },
  { id: "b", x: 72, y: 8 },
] as const;
const SPAN = PHONES[1].x - PHONES[0].x;
// The file is a thick tile that rests in the drop zone of whichever phone holds it
const ZONE = { x: 13, y: 22, w: 26, h: 30 };
const TILE = { w: 20, d: 24, h: 3 };
const BAR = { x: 9, y: 74, w: 34, h: 4 };
const PERIOD = 9;

const STYLES = `
@keyframes isometric192-tile { 0%, 10% { transform: translate(0px, 0px); } 40%, 60% { transform: translate(${(SPAN * C).toFixed(2)}px, ${(SPAN * S).toFixed(2)}px); } 90%, 100% { transform: translate(0px, 0px); } }
@keyframes isometric192-filla { 0%, 10% { transform: translateX(0px); } 40%, 60% { transform: translateX(${-BAR.w}px); } 90%, 100% { transform: translateX(0px); } }
@keyframes isometric192-fillb { 0%, 10% { transform: translateX(${-BAR.w}px); } 40%, 60% { transform: translateX(0px); } 90%, 100% { transform: translateX(${-BAR.w}px); } }
.isometric192-tile { animation: isometric192-tile ${PERIOD}s ease-in-out infinite; }
.isometric192-filla { animation: isometric192-filla ${PERIOD}s ease-in-out infinite; }
.isometric192-fillb { transform: translateX(${-BAR.w}px); animation: isometric192-fillb ${PERIOD}s ease-in-out infinite; }
.isometric192-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric192-scene * { animation: none !important; } }
`;

export function Isometric192({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric192Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  const outline = accent ? (palette === "tone" ? "stroke-white" : "stroke-current") : body.edge;
  const tile = box(PHONES[0].x + ZONE.x + (ZONE.w - TILE.w) / 2, PHONES[0].y + ZONE.y + (ZONE.h - TILE.d) / 2, TOP, TILE.w, TILE.d, TILE.h);

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric192-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-106 -16 228 146" aria-hidden="true" className="isometric192-scene size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={BAR.x} y={BAR.y} width={BAR.w} height={BAR.h} rx={BAR.h / 2} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 132, 112, BASE, 14)} paint={body} />
        {PHONES.map((phone) => (
          <g key={`phone-${phone.id}`}>
            <RoundBlock shape={roundBox(phone.x, phone.y, BASE, W, TALL, THICK, 8)} paint={body} />
            <g transform={onRight(phone.x + W)} className={body.ink}>
              <rect x={phone.y + 24} y={-BASE - 3.4} width={14} height={1.6} rx={0.8} />
            </g>
            <g transform={`${onTop(TOP)} translate(${phone.x} ${phone.y})`}>
              <rect x={3} y={3} width={W - 6} height={TALL - 6} rx={6} className={body.ink} />
              <rect x={W / 2 - 7} y={6} width={14} height={3.6} rx={1.8} className={body.ink} />
              <rect x={9} y={14} width={18} height={3} rx={1.5} className={body.base} />
              {/* The drop zone the file rests in */}
              <rect x={ZONE.x} y={ZONE.y} width={ZONE.w} height={ZONE.h} rx={4} className={cn(body.base, "opacity-40")} />
              <rect x={ZONE.x} y={ZONE.y} width={ZONE.w} height={ZONE.h} rx={4} fill="none" strokeWidth={1} strokeDasharray="3 2.5" className={outline} />
              <rect x={9} y={59} width={26} height={3} rx={1.5} className={body.base} />
              <rect x={9} y={65} width={16} height={2.4} rx={1.2} className={cn(body.base, "opacity-60")} />
              {/* The progress bar is full on the phone that holds the file */}
              <rect x={BAR.x} y={BAR.y} width={BAR.w} height={BAR.h} rx={BAR.h / 2} className={cn(body.base, "opacity-60")} />
              <g clipPath={`url(#${clipId})`}>
                <rect x={BAR.x} y={BAR.y} width={BAR.w} height={BAR.h} rx={BAR.h / 2} className={cn(`isometric192-fill${phone.id}`, accent ? mine.base : body.base)} />
              </g>
              <rect x={9} y={83} width={W - 18} height={7} rx={3.5} className={accent && phone.id === "b" ? mine.base : body.base} />
            </g>
          </g>
        ))}
        {/* The file slides across the two screens from one drop zone to the other and back */}
        <g className="isometric192-tile">
          <Block faces={tile} paint={mine} />
          <g transform={`${onTop(TOP + TILE.h)} translate(${PHONES[0].x + ZONE.x + (ZONE.w - TILE.w) / 2} ${PHONES[0].y + ZONE.y + (ZONE.h - TILE.d) / 2})`} className={mine.ink}>
            <path d={`M${TILE.w - 6} 0L${TILE.w} 6H${TILE.w - 6}Z`} />
            <rect x={3.5} y={9} width={TILE.w - 7} height={2} rx={1} />
            <rect x={3.5} y={13.5} width={TILE.w - 7} height={2} rx={1} />
            <rect x={3.5} y={18} width={TILE.w - 12} height={2} rx={1} />
          </g>
        </g>
      </svg>
    </div>
  );
}
