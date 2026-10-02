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

interface Isometric187Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the sun and the forecast bars with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric187Demo: Isometric187Props = {
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
// The phone lies flat on the desk with the top of the screen at the far end
const AT = { x: 12, y: 10 };
const GLASS_Z = BASE + THICK;
const SCREEN = `${onTop(GLASS_Z)} translate(${AT.x} ${AT.y})`;
// The sun and the cloud stand on the glass; the cloud stays in front of the sun so the two never meet
const SUN = { x: 43, y: 33, r: 8.5, h: 5 };
const CLOUD_H = 6;
const CLOUD = [
  { x: 24, y: 43, w: 12, d: 12, r: 6 },
  { x: 32.5, y: 42, w: 15, d: 15, r: 7.5 },
  { x: 19, y: 49, w: 30, d: 10, r: 5 },
];
const DRIFT = 7;
const ROWS = [
  { from: 4, span: 12 },
  { from: 8, span: 11 },
  { from: 2, span: 10 },
  { from: 6, span: 13 },
];
const INK_STROKE: Record<Palette, string> = { theme: "stroke-foreground/40", light: "stroke-zinc-950/40", dark: "stroke-white/50", tone: "stroke-white/70", glass: "stroke-foreground/40" };

/** The rim of a rounded top face at height z, as projected points. */
function rim(x: number, y: number, w: number, d: number, r: number, z: number) {
  const corners: [number, number, number][] = [
    [x + w - r, y + r, -90],
    [x + w - r, y + d - r, 0],
    [x + r, y + d - r, 90],
    [x + r, y + r, 180],
  ];
  const points: Point[] = [];
  for (const [cx, cy, start] of corners) {
    for (let k = 0; k <= 8; k++) {
      const angle = ((start + (90 * k) / 8) * Math.PI) / 180;
      points.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle), z]);
    }
  }
  return polygon(points);
}

const LUMPS = CLOUD.map((part) => ({
  id: `${part.x}-${part.y}`,
  shape: roundBox(AT.x + part.x, AT.y + part.y, GLASS_Z, part.w, part.d, CLOUD_H, part.r),
  top: rim(AT.x + part.x, AT.y + part.y, part.w, part.d, part.r, GLASS_Z + CLOUD_H),
}));

const slide = (by: number) => `translate(${(by * C).toFixed(2)}px, ${(by * S).toFixed(2)}px)`;

const STYLES = `
@keyframes isometric187-drift { 0%, 100% { transform: ${slide(-DRIFT)}; } 50% { transform: ${slide(DRIFT)}; } }
@keyframes isometric187-rays { from { transform: rotate(0deg); } to { transform: rotate(45deg); } }
.isometric187-drift { animation: isometric187-drift 9s ease-in-out infinite; }
.isometric187-rays { animation: isometric187-rays 6s linear infinite; }
.isometric187-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric187-scene * { animation: none !important; } }
`;

export function Isometric187({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric187Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric187-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-130 -30 217 154" aria-hidden="true" className="isometric187-scene size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, 88, 138, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(AT.x, AT.y, BASE, W, TALL, THICK, 9)} paint={body} />
        <g transform={onRight(AT.x + W)}>
          <rect x={AT.y + 30} y={-(BASE + 3.8)} width={16} height={1.6} rx={0.8} className={body.ink} />
        </g>
        <g transform={SCREEN}>
          <rect x={3} y={3} width={W - 6} height={TALL - 6} rx={7} className={body.ink} />
          <rect x={W / 2 - 8} y={6.5} width={16} height={4} rx={2} className={body.ink} />
          {/* Today: the temperature on a card, with the sun's rays turning around the disc */}
          <rect x={6} y={14} width={52} height={50} rx={5} className={body.base} />
          <g transform="translate(10 18)" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={INK_STROKE[palette]}>
            <path d="M0 2.6a3.1 3.1 0 1 1 5.5 2.2L0 11h6.6" />
            <path d="M15.4 11V0L9.6 7.6h8.2" />
            <circle cx={21.6} cy={1.4} r={1.4} strokeWidth={1.3} />
          </g>
          <g transform={`translate(${SUN.x} ${SUN.y})`}>
            <g className="isometric187-rays">
              {Array.from({ length: 8 }, (_, ray) => (
                <rect key={`ray-${ray}`} x={-0.9} y={-SUN.r - 5.5} width={1.8} height={3.6} rx={0.9} transform={`rotate(${ray * 45})`} className={accent ? mine.base : body.ink} />
              ))}
            </g>
          </g>
          {/* The forecast: a day, its name and the temperature range */}
          {ROWS.map((row, index) => {
            const y = 70 + index * 10.5;
            return (
              <g key={`row-${row.from}`}>
                <circle cx={10.5} cy={y + 3} r={2.8} className={index === 0 && accent ? mine.base : body.base} />
                <rect x={17} y={y + 1.4} width={12} height={3.2} rx={1.6} className={body.base} />
                <rect x={34} y={y + 1.4} width={22} height={3.2} rx={1.6} className={cn(body.base, "opacity-60")} />
                <rect x={34 + row.from} y={y + 1.4} width={row.span} height={3.2} rx={1.6} className={accent ? mine.base : body.base} />
              </g>
            );
          })}
        </g>
        <RoundBlock shape={roundBox(AT.x + SUN.x - SUN.r, AT.y + SUN.y - SUN.r, GLASS_Z, 2 * SUN.r, 2 * SUN.r, SUN.h, SUN.r)} paint={mine} />
        {/* The cloud: sides first, then the tops outlined and filled as one shape */}
        <g className="isometric187-drift">
          {LUMPS.map((lump) => (
            <g key={`side-${lump.id}`} className={body.edge} strokeWidth={1} strokeLinejoin="round">
              <polygon points={lump.shape.side} className={body.base} />
              <polygon points={lump.shape.left} className={body.left} stroke="none" />
              <polygon points={lump.shape.right} className={body.right} stroke="none" />
            </g>
          ))}
          {LUMPS.map((lump) => (
            <polygon key={`line-${lump.id}`} points={lump.top} strokeWidth={2} strokeLinejoin="round" className={cn(body.base, body.edge)} />
          ))}
          {LUMPS.map((lump) => (
            <polygon key={`top-${lump.id}`} points={lump.top} className={body.base} />
          ))}
        </g>
      </svg>
    </div>
  );
}
