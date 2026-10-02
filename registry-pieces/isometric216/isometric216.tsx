"use client";

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

interface Isometric216Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the page button, the status light and the update ring with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric216Demo: Isometric216Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};


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

type Round = ReturnType<typeof roundBox>;

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
const PED = { x: 10, y: 14, w: 86, d: 66, h: 9 };
const PAGE = { x: 15, y: 19, w: 76, d: 56, h: 4 };
const PAGE_Z = BASE + PED.h + PAGE.h;
// The service unit: a low drum joined to the pedestal by a flat cable
const UNIT = { x: 126, y: 47, r: 17, h: 12 };
const UNIT_Z = BASE + UNIT.h;
const RING = 9.5;
// Drawn turned by 45 degrees in plan, so it reads upright on the tilted top
const CHECK = "M-3.3 0L-1 3.7L3.6 -4.2";
const PERIOD = 9;

const STYLES = `
@keyframes isometric216-cycle { 0%, 8% { opacity: 0; } 14%, 84% { opacity: 1; } 92%, 100% { opacity: 0; } }
@keyframes isometric216-ring { 0%, 14% { stroke-dashoffset: 1; } 52%, 100% { stroke-dashoffset: 0; } }
@keyframes isometric216-check { 0%, 56% { stroke-dashoffset: 1; } 64%, 100% { stroke-dashoffset: 0; } }
@keyframes isometric216-light { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
.isometric216-cycle { animation: isometric216-cycle ${PERIOD}s ease-in-out infinite; }
.isometric216-ring { animation: isometric216-ring ${PERIOD}s ease-in-out infinite; }
.isometric216-check { animation: isometric216-check ${PERIOD}s ease-in-out infinite; }
.isometric216-light { animation: isometric216-light 3s ease-in-out infinite; }
.isometric216-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric216-scene * { animation: none !important; } }
`;

export function Isometric216({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric216Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  // A line drawn on top of an accent fill, and one drawn in the accent on a neutral fill
  const inAccent = accent ? (palette === "tone" ? "stroke-white" : "stroke-current") : body.edge;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric216-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-92 -36 236 170" aria-hidden="true" className="isometric216-scene size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, 152, 94, BASE, 14)} paint={body} />
        {/* The pedestal and the page lying on it */}
        <RoundBlock shape={roundBox(PED.x, PED.y, BASE, PED.w, PED.d, PED.h, 9)} paint={body} />
        <RoundBlock shape={roundBox(PAGE.x, PAGE.y, BASE + PED.h, PAGE.w, PAGE.d, PAGE.h, 6)} paint={body} />
        <g transform={`${onTop(PAGE_Z)} translate(${PAGE.x} ${PAGE.y})`}>
          {[0, 1, 2].map((dot) => (
            <circle key={`dot-${dot}`} cx={6 + dot * 4.2} cy={5.2} r={1.3} className={body.ink} />
          ))}
          <rect x={20} y={2.9} width={34} height={4.6} rx={2.3} className={body.ink} />
          <circle cx={PAGE.w - 7} cy={5.2} r={2} className={cn("isometric216-light", accent ? mine.base : body.ink)} />
          <rect x={5} y={13} width={32} height={4.4} rx={2.2} className={body.ink} />
          <rect x={5} y={20} width={22} height={2.6} rx={1.3} className={body.ink} />
          <rect x={5} y={26} width={17} height={6.4} rx={3.2} className={accent ? mine.base : body.ink} />
          <rect x={43} y={12} width={28} height={21} rx={4} className={body.ink} />
          {[5, 39.5].map((x) => (
            <g key={`card-${x}`}>
              <rect x={x} y={37} width={31.5} height={14} rx={4} className={body.ink} />
              <rect x={x + 4} y={41} width={15} height={2.4} rx={1.2} className={body.base} />
              <rect x={x + 4} y={45.6} width={22} height={2.2} rx={1.1} className={body.base} />
            </g>
          ))}
        </g>
        {/* The cable, then the service unit with its ring on top */}
        <Block faces={box(PED.x + PED.w - 1, UNIT.y - 3, BASE, UNIT.x - UNIT.r - PED.x - PED.w + 4, 6, 2)} paint={body} />
        <RoundBlock shape={roundBox(UNIT.x - UNIT.r, UNIT.y - UNIT.r, BASE, 2 * UNIT.r, 2 * UNIT.r, UNIT.h, UNIT.r)} paint={body} />
        <g transform={`${onTop(UNIT_Z)} translate(${UNIT.x} ${UNIT.y})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle r={RING + 4} stroke="none" className={body.ink} />
          <circle r={RING} strokeWidth={3} className={body.edge} />
          <g className="isometric216-cycle">
            <circle r={RING} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={0} transform="rotate(-135)" className={cn("isometric216-ring", inAccent)} />
            <path d={CHECK} transform="rotate(-45)" strokeWidth={2.4} pathLength={1} strokeDasharray={1} strokeDashoffset={0} className={cn("isometric216-check", inAccent)} />
          </g>
        </g>
      </svg>
    </div>
  );
}
