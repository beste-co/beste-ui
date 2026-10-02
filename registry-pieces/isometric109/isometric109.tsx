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

interface Isometric109Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the twin bells with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric109Demo: Isometric109Props = {
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

// A plan circle of radius r projects to an ellipse with these radii; a sphere to a circle of RX
const RX = C * Math.SQRT2;
const RY = S * Math.SQRT2;

/** A half sphere of radius r sitting on a circle centered at screen point (sx, sy). */
function Dome({ sx, sy, r, paint }: { sx: number; sy: number; r: number; paint: Paint }) {
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

const MAT = 6;
const R = 32;
const DEPTH = 14;
const CZ = MAT + 10 + R;
// The dial faces the viewer: a vertical plane across the diagonal, drawn in (u, -z) and pushed w toward the viewer
const U = C * Math.SQRT2;
const facing = (w: number) => `matrix(${U.toFixed(4)} 0 0 1 0 ${(w * S * Math.SQRT2).toFixed(2)})`;
const BELLS = [-1, 1].map((side) => {
  const angle = (42 * Math.PI) / 180;
  return { side, sx: side * (R + 1) * Math.sin(angle) * U, sy: -CZ - (R + 1) * Math.cos(angle) };
});
const FEET = [-1, 1].map((side) => (side * R * Math.sin((40 * Math.PI) / 180)) / Math.SQRT2);
const TICKS = Array.from({ length: 12 }, (_, index) => index * 30);
const RAYS = [-56, -28, 0, 28, 56];

const STYLES = `
@keyframes isometric109-minute { 0% { transform: rotate(0deg); } 58%, 100% { transform: rotate(360deg); } }
@keyframes isometric109-hour { 0% { transform: rotate(0deg); } 58%, 100% { transform: rotate(30deg); } }
@keyframes isometric109-shake { 0%, 60%, 84%, 100% { transform: translateX(0) rotate(0deg); } 62%, 66%, 70%, 74%, 78% { transform: translateX(-1.5px) rotate(-2deg); } 64%, 68%, 72%, 76%, 80% { transform: translateX(1.5px) rotate(2deg); } }
@keyframes isometric109-hammer { 0%, 60%, 82%, 100% { transform: translateX(0); } 61%, 63%, 65%, 67%, 69%, 71%, 73%, 75%, 77%, 79% { transform: translateX(-3px); } 62%, 64%, 66%, 68%, 70%, 72%, 74%, 76%, 78%, 80% { transform: translateX(3px); } }
@keyframes isometric109-ring { 0%, 60% { transform: scale(0.7); opacity: 0; } 64% { transform: scale(1); opacity: 1; } 80% { transform: scale(1.1); opacity: 1; } 88%, 100% { transform: scale(1.2); opacity: 0; } }
.isometric109-minute, .isometric109-hour { animation: 6s cubic-bezier(0.45, 0, 0.55, 1) infinite; transform-box: fill-box; transform-origin: center; will-change: transform; }
.isometric109-minute { animation-name: isometric109-minute; }
.isometric109-hour { animation-name: isometric109-hour; }
.isometric109-shake { animation: isometric109-shake 6s linear infinite; transform-box: fill-box; transform-origin: 50% 100%; will-change: transform; }
.isometric109-hammer { animation: isometric109-hammer 6s linear infinite; }
.isometric109-ring { animation: isometric109-ring 6s ease-out infinite; transform-box: fill-box; transform-origin: center; }
.isometric109-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric109-minute, .isometric109-hour, .isometric109-shake, .isometric109-hammer, .isometric109-ring { animation: none; } }
`;

export function Isometric109({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric109Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const bell = paint.accent;
  const hand = palette === "tone" ? "fill-black/70" : palette === "dark" ? "fill-zinc-100" : palette === "light" ? "fill-zinc-900" : "fill-foreground";
  const [hx, hy] = [0, -CZ - R];
  const rayPaint = accent ? bell.base : body.ink;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric109-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-58 -134 116 170" aria-hidden="true" className="size-full overflow-visible">
        <RoundBlock shape={roundBox(-40, -40, 0, 80, 80, MAT, 40)} paint={body} />
        <g className="isometric109-shake">
          {BELLS.map(({ side, sx, sy }) => (
            <g key={side} transform={`rotate(${side * 46} ${sx} ${sy})`}>
              <rect x={sx - 2} y={sy - 2} width={4} height={8} className={body.base} />
              <Dome sx={sx} sy={sy - 4} r={12} paint={bell} />
            </g>
          ))}
          <g className="isometric109-hammer">
            <rect x={hx - 1.5} y={hy - 12} width={3} height={14} rx={1.5} strokeWidth={1} className={cn(body.base, body.edge)} />
            <circle cx={hx} cy={hy - 13} r={4} strokeWidth={1} className={cn(body.base, body.edge)} />
            <circle cx={hx} cy={hy - 13} r={4} className={body.right} />
          </g>
          {FEET.map((x) => (
            <Block key={x} faces={box(x - 3, -x - 3, MAT, 6, 6, 14)} paint={body} />
          ))}
          {Array.from({ length: DEPTH }, (_, k) => (
            <g key={k} transform={facing(k - DEPTH / 2)}>
              <circle cx={0} cy={-CZ} r={R} strokeWidth={1} vectorEffect="non-scaling-stroke" className={cn(body.base, k === 0 && body.edge)} />
              <circle cx={0} cy={-CZ} r={R} className={body.left} />
            </g>
          ))}
          <g transform={facing(DEPTH / 2)}>
            <circle cx={0} cy={-CZ} r={R} strokeWidth={1} vectorEffect="non-scaling-stroke" className={cn(body.base, body.edge)} />
            <circle cx={0} cy={-CZ} r={R - 5} className={body.ink} />
            <circle cx={0} cy={-CZ} r={R - 7} className={body.base} />
            {TICKS.map((angle) => (
              <rect key={angle} x={angle % 90 === 0 ? -1.25 : -0.75} y={-CZ - R + 9} width={angle % 90 === 0 ? 2.5 : 1.5} height={angle % 90 === 0 ? 5 : 3.5} rx={0.75} transform={`rotate(${angle} 0 ${-CZ})`} className={body.ink} />
            ))}
            <g className="isometric109-hour">
              <circle cx={0} cy={-CZ} r={14} fill="none" />
              <rect x={-1.5} y={-CZ - 13} width={3} height={14} rx={1.5} transform={`rotate(-60 0 ${-CZ})`} className={hand} />
            </g>
            <g className="isometric109-minute">
              <circle cx={0} cy={-CZ} r={20} fill="none" />
              <rect x={-1} y={-CZ - 19} width={2} height={20} rx={1} transform={`rotate(60 0 ${-CZ})`} className={hand} />
            </g>
            <circle cx={0} cy={-CZ} r={2.5} className={hand} />
          </g>
        </g>
        <g className="isometric109-ring opacity-0">
          {RAYS.map((angle) => (
            <rect key={angle} x={hx - 2} y={hy - 46} width={4} height={10} rx={2} transform={`rotate(${angle} ${hx} ${hy})`} className={rayPaint} />
          ))}
        </g>
      </svg>
    </div>
  );
}
