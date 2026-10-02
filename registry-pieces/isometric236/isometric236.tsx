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

interface Isometric236Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the needle, the reached part of the track, the score and the metric fills with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric236Demo: Isometric236Props = {
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
// The gauge is an upright panel in the plane y = PANEL.y, drawn in (x, -z) units
const PANEL = { x: 20, y: 30, w: 84, tall: 92, thick: 6, z: BASE + 4 };
const SLICES = Array.from({ length: PANEL.thick }, (_, index) => PANEL.y + index);
const FACE = PANEL.y + PANEL.thick;
const HUB = { x: PANEL.x + PANEL.w / 2, z: PANEL.z + 50 };
const RADIUS = 30;
// Needle angles, clockwise from straight up
const SLOW = -78;
const FAST = 62;
const SPAN = FAST + 90;
const rim = (angle: number) => {
  const t = (angle * Math.PI) / 180;
  return `${(HUB.x + RADIUS * Math.sin(t)).toFixed(2)} ${(-HUB.z - RADIUS * Math.cos(t)).toFixed(2)}`;
};
const TRACK = `M${rim(-90)}A${RADIUS} ${RADIUS} 0 0 1 ${rim(90)}`;
const REACHED = `M${rim(-90)}A${RADIUS} ${RADIUS} 0 0 1 ${rim(FAST)}`;
const NEEDLE = [0.6, 1.2, 1.8];
const CAP = [0.8, 1.6, 2.4, 3.2];
const METRICS = [
  { key: "a", fill: 50, delay: 0 },
  { key: "b", fill: 40, delay: 6 },
  { key: "c", fill: 54, delay: 12 },
];
const ROW = { w: 60, h: 3.4 };

const PERIOD = 9;
const fill = (key: string, width: number, delay: number) =>
  `@keyframes isometric236-${key} { 0%, ${14 + delay}% { transform: translateX(${-width}px); } ${30 + delay}%, 82% { transform: translateX(0px); } 92%, 100% { transform: translateX(${-width}px); } }
.isometric236-${key} { animation: isometric236-${key} ${PERIOD}s ease-in-out infinite; }`;

const STYLES = `
@keyframes isometric236-needle { 0%, 10% { transform: rotate(${SLOW - FAST}deg); } 34%, 80% { transform: rotate(0deg); } 92%, 100% { transform: rotate(${SLOW - FAST}deg); } }
@keyframes isometric236-reach { 0%, 10% { stroke-dashoffset: ${(1 - (SLOW + 90) / SPAN).toFixed(3)}; } 34%, 80% { stroke-dashoffset: 0; } 92%, 100% { stroke-dashoffset: ${(1 - (SLOW + 90) / SPAN).toFixed(3)}; } }
.isometric236-needle { animation: isometric236-needle ${PERIOD}s ease-in-out infinite; }
.isometric236-reach { stroke-dasharray: 1; animation: isometric236-reach ${PERIOD}s ease-in-out infinite; }
${METRICS.map((metric) => fill(metric.key, metric.fill, metric.delay)).join("\n")}
.isometric236-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric236-scene * { animation: none !important; } }
`;

export function Isometric236({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric236Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  // A line drawn in the accent on a neutral fill
  const inAccent = accent ? (palette === "tone" ? "stroke-white" : "stroke-current") : body.edge;
  const clipId = useId();
  const panel = { x: PANEL.x, y: -(PANEL.z + PANEL.tall), width: PANEL.w, height: PANEL.tall, rx: 9 };

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric236-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-80 -96 206 212" aria-hidden="true" className="isometric236-scene size-full overflow-visible">
        <defs>
          {METRICS.map((metric, index) => (
            <clipPath key={`clip-${metric.key}`} id={`${clipId}-${metric.key}`}>
              <rect x={HUB.x - ROW.w / 2} y={-HUB.z + 28 + index * 6.2} width={metric.fill} height={ROW.h} rx={ROW.h / 2} />
            </clipPath>
          ))}
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 124, 72, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(PANEL.x + 12, PANEL.y - 7, BASE, PANEL.w - 24, 20, 4, 7)} paint={body} />
        {/* The panel: thin slices from the back to the face */}
        {SLICES.map((y, index) => (
          <g key={`slice-${y}`} transform={onLeft(y)} className={body.edge} strokeWidth={index === 0 ? 1 : 0}>
            <rect {...panel} className={body.base} />
            <rect {...panel} className={body.right} stroke="none" />
          </g>
        ))}
        <g transform={onLeft(FACE)}>
          <rect {...panel} strokeWidth={1} className={cn(body.base, body.edge)} />
          {/* The track, and over it the part the needle has reached */}
          <path d={TRACK} fill="none" strokeWidth={7} strokeLinecap="round" className={body.edge} />
          <path d={REACHED} pathLength={1} fill="none" strokeWidth={7} strokeLinecap="round" className={cn("isometric236-reach", inAccent)} />
          {/* The score, and three metrics filling under it */}
          <rect x={HUB.x - 15} y={-HUB.z + 12} width={30} height={10} rx={5} className={accent ? mine.base : body.ink} />
          <rect x={HUB.x - 7} y={-HUB.z + 15.7} width={14} height={2.6} rx={1.3} className={accent ? mine.ink : body.base} />
          {METRICS.map((metric, index) => (
            <g key={`metric-${metric.key}`}>
              <rect x={HUB.x - ROW.w / 2} y={-HUB.z + 28 + index * 6.2} width={ROW.w} height={ROW.h} rx={ROW.h / 2} className={body.ink} />
              <g clipPath={`url(#${clipId}-${metric.key})`}>
                <rect x={HUB.x - ROW.w / 2} y={-HUB.z + 28 + index * 6.2} width={metric.fill} height={ROW.h} className={cn(`isometric236-${metric.key}`, accent ? mine.base : body.ink)} />
              </g>
            </g>
          ))}
        </g>
        {/* The needle turns about the hub, just in front of the face */}
        {NEEDLE.map((lift, index) => (
          <g key={`needle-${lift}`} transform={`${onLeft(FACE + lift)} translate(${HUB.x} ${-HUB.z}) rotate(${FAST})`}>
            <g className="isometric236-needle">
              <rect x={-1.5} y={-(RADIUS - 6)} width={3} height={RADIUS - 2} rx={1.5} className={accent ? mine.base : body.base} />
              {index < NEEDLE.length - 1 && <rect x={-1.5} y={-(RADIUS - 6)} width={3} height={RADIUS - 2} rx={1.5} className={accent ? mine.right : body.right} />}
            </g>
          </g>
        ))}
        {/* The hub cap, a short cylinder standing out of the face */}
        {CAP.map((lift, index) => (
          <g key={`cap-${lift}`} transform={`${onLeft(FACE + NEEDLE.length * 0.6 + lift)} translate(${HUB.x} ${-HUB.z})`} className={body.edge} strokeWidth={index === CAP.length - 1 ? 1 : 0}>
            <circle r={5} className={body.base} />
            {index < CAP.length - 1 && <circle r={5} className={body.right} stroke="none" />}
            {index === CAP.length - 1 && <circle r={1.6} className={body.ink} stroke="none" />}
          </g>
        ))}
      </svg>
    </div>
  );
}
