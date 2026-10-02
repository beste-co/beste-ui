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

interface Isometric73Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the sound rings with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric73Demo: Isometric73Props = {
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

/** Screen point of a plan position. */
const at = (x: number, y: number, z: number) => [(x - y) * C, (x + y) * S - z] as const;
// A plan circle of radius r projects to an ellipse with these radii; a sphere to a circle of RX
const RX = C * Math.SQRT2;
const RY = S * Math.SQRT2;

/** A half sphere of radius r sitting on the circle at (cx, cy, z), shaded in two halves. */
function Dome({ cx, cy, z, r, paint }: { cx: number; cy: number; z: number; r: number; paint: Paint }) {
  const [sx, sy] = at(cx, cy, z);
  const rx = r * RX;
  const ry = r * RY;
  const whole = `M${sx - rx} ${sy}A${rx} ${rx} 0 0 1 ${sx + rx} ${sy}A${rx} ${ry} 0 0 1 ${sx - rx} ${sy}Z`;
  const left = `M${sx - rx} ${sy}A${rx} ${rx} 0 0 1 ${sx} ${sy - rx}L${sx} ${sy + ry}A${rx} ${ry} 0 0 1 ${sx - rx} ${sy}Z`;
  const right = `M${sx + rx} ${sy}A${rx} ${rx} 0 0 0 ${sx} ${sy - rx}L${sx} ${sy + ry}A${rx} ${ry} 0 0 0 ${sx + rx} ${sy}Z`;
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <path d={whole} className={paint.base} />
      <path d={left} className={paint.left} stroke="none" />
      <path d={right} className={paint.right} stroke="none" />
    </g>
  );
}

/** A thin band around the front of an upright cylinder, from z up by t. */
function band(cx: number, cy: number, z: number, r: number, t: number) {
  const [sx, sy] = at(cx, cy, z);
  const rx = r * RX;
  const ry = r * RY;
  return `M${sx - rx} ${sy}A${rx} ${ry} 0 0 0 ${sx + rx} ${sy}L${sx + rx} ${sy - t}A${rx} ${ry} 0 0 1 ${sx - rx} ${sy - t}Z`;
}

const MIC_R = 16;
const MIC_Z = 34;
const MIC_H = 38;
const RING_Z = MIC_Z + MIC_H / 2 + 6;

// Sound rings stand in the screen plane, centered on the grille
function sector(outer: number, inner: number, from: number, to: number) {
  const point = (r: number, deg: number) => {
    const a = (deg * Math.PI) / 180;
    return `${(r * Math.cos(a)).toFixed(2)} ${(-RING_Z + r * Math.sin(a)).toFixed(2)}`;
  };
  return `M${point(outer, from)} A${outer} ${outer} 0 0 1 ${point(outer, to)} L${point(inner, to)} A${inner} ${inner} 0 0 0 ${point(inner, from)} Z`;
}
const RINGS = [30, 40, 50].map((r, index) => ({ index, left: sector(r + 5, r, 150, 210), right: sector(r + 5, r, -30, 30) }));

const STYLES = `
@keyframes isometric73-pulse { 0%, 60%, 100% { opacity: 0.2; } 20%, 36% { opacity: 1; } }
.isometric73-ring { animation: isometric73-pulse 3.2s ease-in-out infinite; }
.isometric73-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric73-ring { animation: none; } }
`;

export function Isometric73({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric73Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const ring = (d: string, index: number, side: string) => (
    <g key={index} className="isometric73-ring" style={{ animationDelay: `${index * 0.3}s` }}>
      <g transform="translate(0 3)">
        <path d={d} className={paint.accent.base} />
        <path d={d} className={paint.accent.right} />
      </g>
      <g strokeWidth={1} strokeLinejoin="round" className={paint.accent.edge}>
        <path d={d} className={paint.accent.base} />
        {side && <path d={d} stroke="none" className={side} />}
      </g>
    </g>
  );

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric73-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-80 -118 160 164" aria-hidden="true" className="size-full overflow-visible">
        <RoundBlock shape={roundBox(-32, -32, 0, 64, 64, 8, 32)} paint={paint.body} />
        <g transform={onTop(8)} className={paint.body.ink}>
          <path d="M-24 0a24 24 0 1 0 48 0a24 24 0 1 0 -48 0ZM-21 0a21 21 0 1 1 42 0a21 21 0 1 1 -42 0Z" fillRule="evenodd" />
        </g>
                <RoundBlock shape={roundBox(-4, -4, 8, 8, 8, MIC_Z - 14, 4)} paint={paint.body} />
        <RoundBlock shape={roundBox(-12, -12, MIC_Z - 6, 24, 24, 6, 12)} paint={paint.body} />
        <RoundBlock shape={roundBox(-MIC_R, -MIC_R, MIC_Z, MIC_R * 2, MIC_R * 2, MIC_H, MIC_R)} paint={paint.body} />
        <Dome cx={0} cy={0} z={MIC_Z + MIC_H} r={MIC_R} paint={paint.body} />
        <g className={paint.body.ink}>
          {[14, 20, 26, 32].map((z) => (
            <path key={z} d={band(0, 0, MIC_Z + z, MIC_R, 2)} />
          ))}
        </g>
        {RINGS.map((item) => ring(item.left, item.index, ""))}
        {RINGS.map((item) => ring(item.right, item.index, paint.accent.left))}
      </svg>
    </div>
  );
}
