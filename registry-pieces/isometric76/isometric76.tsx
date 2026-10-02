"use client";

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

interface Isometric76Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the paint pool and the brush tip with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric76Demo: Isometric76Props = {
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

/** A flat plan shape pushed up from z by h, one unit per layer, lit from the top. */
function Slab({ d, z, h, paint }: { d: string; z: number; h: number; paint: Paint }) {
  return (
    <g>
      {Array.from({ length: h }, (_, k) => (
        <g key={k} transform={onTop(z + k)}>
          <path d={d} strokeWidth={1} vectorEffect="non-scaling-stroke" className={cn(paint.base, k === 0 && paint.edge)} />
          <path d={d} className={paint.right} />
        </g>
      ))}
      <path d={d} transform={onTop(z + h)} strokeWidth={1} vectorEffect="non-scaling-stroke" className={cn(paint.base, paint.edge)} />
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

const BOARD =
  "M22 8C62 -8 112 -2 128 30C140 58 116 90 80 88C62 87 60 74 48 76C36 78 32 94 16 86C-6 74 -6 22 22 8ZM24 50a8 8 0 1 0 16 0a8 8 0 1 0 -16 0Z";
const T = 8;
const DABS = [
  { x: 42, y: 20, r: 9 },
  { x: 68, y: 14, r: 9 },
  { x: 94, y: 18, r: 9 },
  { x: 116, y: 38, r: 9 },
];
const POOL = { x: 92, y: 64, r: 13 };
const TIP_Z = T + 18;
const DIP = 14;

const STYLES = `
@keyframes isometric76-dip { 0%, 16% { transform: translateY(0); } 34%, 46% { transform: translateY(${DIP}px); } 64%, 100% { transform: translateY(0); } }
@keyframes isometric76-tip { 0%, 30% { opacity: 0; } 38%, 88% { opacity: 1; } 100% { opacity: 0; } }
@keyframes isometric76-ripple { 0%, 34% { transform: scale(0.6); opacity: 0; } 38% { opacity: 1; } 60%, 100% { transform: scale(1.4); opacity: 0; } }
.isometric76-brush { animation: isometric76-dip 4.4s cubic-bezier(0.45, 0, 0.2, 1) infinite; }
.isometric76-tip { animation: isometric76-tip 4.4s ease-in-out infinite; }
.isometric76-ripple { animation: isometric76-ripple 4.4s ease-out infinite; transform-box: fill-box; transform-origin: center; }
.isometric76-still * { animation: none !important; }
.isometric76-still .isometric76-rest { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .isometric76-brush, .isometric76-tip, .isometric76-ripple { animation: none; } .isometric76-rest { opacity: 1; } }
`;

export function Isometric76({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric76Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const [bx, by] = at(POOL.x, POOL.y, TIP_Z);
  const bristle = `M${bx - 7} ${by - 18}C${bx - 7} ${by - 8} ${bx - 3} ${by - 2} ${bx} ${by}C${bx + 3} ${by - 2} ${bx + 7} ${by - 8} ${bx + 7} ${by - 18}Z`;
  const bristleLeft = `M${bx - 7} ${by - 18}C${bx - 7} ${by - 8} ${bx - 3} ${by - 2} ${bx} ${by}V${by - 18}Z`;
  const tip = `M${bx - 5.6} ${by - 9}C${bx - 4.6} ${by - 5} ${bx - 2.4} ${by - 1.6} ${bx} ${by}C${bx + 2.4} ${by - 1.6} ${bx + 4.6} ${by - 5} ${bx + 5.6} ${by - 9}Z`;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric76-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-68 -32 160 126" aria-hidden="true" className="size-full overflow-visible">
        <g fillRule="evenodd">
          <Slab d={BOARD} z={0} h={T} paint={paint.body} />
        </g>
        {DABS.map((dab) => (
          <g key={dab.x}>
            <RoundBlock shape={roundBox(dab.x - dab.r, dab.y - dab.r, T, dab.r * 2, dab.r * 2, 3, dab.r)} paint={paint.body} />
            <circle cx={dab.x} cy={dab.y} r={dab.r - 2.5} transform={onTop(T + 3)} className={paint.body.ink} />
          </g>
        ))}
        <RoundBlock shape={roundBox(POOL.x - POOL.r, POOL.y - POOL.r, T, POOL.r * 2, POOL.r * 2, 3, POOL.r)} paint={paint.accent} />
        <g transform={onTop(T + 3)}>
          <circle cx={POOL.x} cy={POOL.y} r={POOL.r - 3} strokeWidth={1.5} vectorEffect="non-scaling-stroke" className={cn("isometric76-ripple fill-transparent opacity-0", accent ? "stroke-white/60" : "stroke-current opacity-0")} />
        </g>
        <g className="isometric76-brush">
          <path d={bristle} strokeWidth={1} strokeLinejoin="round" className={cn(paint.body.base, paint.body.edge)} />
          <path d={bristleLeft} className={paint.body.left} />
          <path d={tip} className={cn("isometric76-tip isometric76-rest opacity-0", accent ? paint.accent.base : paint.body.ink)} />
          <RoundBlock shape={roundBox(POOL.x - 6, POOL.y - 6, TIP_Z + 18, 12, 12, 10, 6)} paint={paint.body} />
          <RoundBlock shape={roundBox(POOL.x - 4, POOL.y - 4, TIP_Z + 28, 8, 8, 44, 4)} paint={paint.body} />
          <Dome cx={POOL.x} cy={POOL.y} z={TIP_Z + 72} r={4} paint={paint.body} />
        </g>
      </svg>
    </div>
  );
}
