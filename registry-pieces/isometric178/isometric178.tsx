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

interface Isometric178Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the charge ring, ticks and stand light with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric178Demo: Isometric178Props = {
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
// The charging puck sits behind the phone in the same lean, on a neck that rises from the foot
const PUCK = { up: 62, r: 39, depth: 4 };
const PUCK_LAYERS = Array.from({ length: PUCK.depth }, (_, index) => THICK + PUCK.depth - index);
// The charge ring on the screen, in screen units
const RING = { x: W / 2, y: 50, r: 19 };
const LAP = 2 * Math.PI * RING.r;
const TICKS = Array.from({ length: 10 }, (_, index) => index);
const BOLT = "M2.5 -9L-5 1.5H-0.5L-2.5 9L5 -1.5H0.5Z";
const PERIOD = 9;
// Ring and ticks follow the theme when they carry no tone
const RING_STROKE: Record<Palette, string> = { theme: "stroke-card", light: "stroke-white", dark: "stroke-zinc-400", tone: "stroke-white" };
const TRACK_STROKE: Record<Palette, string> = { theme: "stroke-foreground/15", light: "stroke-zinc-950/15", dark: "stroke-white/15", tone: "stroke-white/30" };

const STYLES = `
@keyframes isometric178-fill { 0%, 6% { stroke-dashoffset: ${LAP.toFixed(1)}; opacity: 1; } 62%, 92% { stroke-dashoffset: 0; opacity: 1; } 97%, 100% { stroke-dashoffset: 0; opacity: 0; } }
@keyframes isometric178-pulse { 0%, 62% { transform: scale(1); } 66% { transform: scale(1.08); } 71%, 100% { transform: scale(1); } }
@keyframes isometric178-bolt { 0%, 62% { opacity: 1; } 65%, 96% { opacity: 0; } 100% { opacity: 1; } }
@keyframes isometric178-full { 0%, 63% { opacity: 0; transform: scale(0.5); } 67% { opacity: 1; transform: scale(1.15); } 70%, 92% { opacity: 1; transform: scale(1); } 97%, 100% { opacity: 0; transform: scale(1); } }
${TICKS.map((tick) => `@keyframes isometric178-tick${tick} { 0%, ${(8 + tick * 5.4).toFixed(1)}% { opacity: 0; } ${(10 + tick * 5.4).toFixed(1)}%, 92% { opacity: 1; } 97%, 100% { opacity: 0; } }
.isometric178-tick${tick} { animation: isometric178-tick${tick} ${PERIOD}s linear infinite; }`).join("\n")}
@keyframes isometric178-wave { 0% { transform: scale(0.45); opacity: 0; } 20% { opacity: 0.7; } 100% { transform: scale(1); opacity: 0; } }
@keyframes isometric178-led { 0%, 100% { opacity: 0.35; } 50% { opacity: 1; } }
.isometric178-fill { animation: isometric178-fill ${PERIOD}s cubic-bezier(0.4, 0, 0.3, 1) infinite; }
.isometric178-pulse { animation: isometric178-pulse ${PERIOD}s ease-out infinite; transform-origin: ${RING.x}px ${RING.y}px; }
.isometric178-bolt { animation: isometric178-bolt ${PERIOD}s linear infinite; }
.isometric178-full { animation: isometric178-full ${PERIOD}s ease-out infinite; transform-origin: ${RING.x}px ${RING.y}px; }
.isometric178-wave { animation: isometric178-wave 3s ease-out infinite; transform-origin: 50px 36px; }
.isometric178-led { animation: isometric178-led 2.4s ease-in-out infinite; }
.isometric178-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric178-scene * { animation: none !important; } }
`;

export function Isometric178({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric178Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const lit = paint.accent;
  const ring = accent ? (palette === "tone" ? "stroke-white" : "stroke-current") : RING_STROKE[palette];
  const glyph = accent ? lit.base : body.base;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric178-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-70 -116 166 210" aria-hidden="true" className="isometric178-scene size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={0} y={0} width={100} height={72} rx={14} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 100, 72, BASE, 14)} paint={body} />
        {/* Rings of charge spread over the base from under the stand */}
        <g transform={onTop(BASE)} clipPath={`url(#${clipId})`} fill="none" strokeWidth={1.5} className={ring}>
          {[0, 1].map((wave) => (
            <circle key={wave} cx={50} cy={36} r={46} className="isometric178-wave opacity-0" style={{ animationDelay: `${wave * 1.5}s` }} />
          ))}
        </g>
        {/* The cable leaves the back of the foot, runs over the base and drops off its edge */}
        <g transform={onTop(BASE)} fill="none" strokeLinecap="round">
          <path d="M84 24C92 24 94 30 100 30" strokeWidth={4} className={body.edge} />
          <path d="M84 24C92 24 94 30 100 30" strokeWidth={2.5} className={RING_STROKE[palette === "tone" ? "tone" : palette]} />
        </g>
        <g transform={onRight(100)}>
          <rect x={28.6} y={-BASE} width={2.8} height={BASE} className={body.ink} />
        </g>
        <RoundBlock shape={roundBox(FOOT.x - 6, 14, BASE, W + 12, 44, 3, 8)} paint={body} />
        {/* Neck and puck lean with the phone and sit right behind it, built from thin layers back to front */}
        {PUCK_LAYERS.map((depth, index) => {
          const front = index === PUCK_LAYERS.length - 1;
          return (
            <g key={depth} transform={plane(depth, TALL)} className={body.edge} strokeWidth={front ? 1 : 0}>
              <rect x={W / 2 - 8} y={TALL - PUCK.up} width={16} height={PUCK.up} className={body.base} />
              <rect x={W / 2 - 8} y={TALL - PUCK.up} width={16} height={PUCK.up} className={body.right} stroke="none" />
              <circle cx={W / 2} cy={TALL - PUCK.up} r={PUCK.r} className={body.base} />
              <circle cx={W / 2} cy={TALL - PUCK.up} r={PUCK.r} className={front ? body.left : body.right} stroke="none" />
              {front && <circle cx={W / 2} cy={TALL - PUCK.up} r={PUCK.r - 3.5} fill="none" strokeWidth={1.5} className={cn("isometric178-led", ring)} stroke="currentColor" />}
            </g>
          );
        })}
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
          <rect x={W / 2 - 11} y={17} width={22} height={3} rx={1.5} className={body.base} />
          {/* The charge ring: a faint track, then the arc that fills round from the top */}
          <g className="isometric178-pulse" fill="none">
            <circle cx={RING.x} cy={RING.y} r={RING.r} strokeWidth={5} className={TRACK_STROKE[palette]} />
            <circle cx={RING.x} cy={RING.y} r={RING.r} strokeWidth={5} strokeLinecap="round" strokeDasharray={LAP.toFixed(1)} strokeDashoffset={0} transform={`rotate(-90 ${RING.x} ${RING.y})`} className={cn("isometric178-fill", ring)} />
          </g>
          <path d={BOLT} transform={`translate(${RING.x} ${RING.y})`} className={cn("isometric178-bolt opacity-0", glyph)} />
          <g className="isometric178-full">
            <path d={`M${RING.x - 7} ${RING.y + 0.5}l4.6 4.8l9 -10.2`} fill="none" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className={ring} />
          </g>
          {/* A row of ticks that light up as the charge climbs */}
          {TICKS.map((tick) => (
            <g key={tick}>
              <rect x={10 + tick * 4.6} y={80} width={2.6} height={7} rx={1.3} className={body.base} opacity={0.25} />
              <rect x={10 + tick * 4.6} y={80} width={2.6} height={7} rx={1.3} className={cn(`isometric178-tick${tick}`, glyph)} />
            </g>
          ))}
          <rect x={16} y={94} width={32} height={3} rx={1.5} className={body.base} />
          <rect x={22} y={100} width={20} height={2.4} rx={1.2} className={body.base} opacity={0.5} />
        </g>
        {/* The lip of the stand holds the bottom edge of the phone; its light breathes while charging */}
        <RoundBlock shape={roundBox(FOOT.x - 4, FOOT.y - 1, BASE + 3, W + 8, 6, 5, 2.5)} paint={body} />
        <g transform={onLeft(FOOT.y + 5)}>
          <rect x={FOOT.x + W / 2 - 5} y={-(BASE + 6.5)} width={10} height={2} rx={1} className={cn("isometric178-led", glyph)} />
        </g>
      </svg>
    </div>
  );
}
