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

interface Isometric227Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the server lights, the land they cover and the nearest server with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric227Demo: Isometric227Props = {
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

const BASE = 7;
const POST = 9;
// Four servers on the plate, far to near; the nearest one answers last
const A = { x: 34, y: 34, h: 22 };
const B = { x: 84, y: 34, h: 18 };
const D = { x: 34, y: 84, h: 18 };
const NEAR = { x: 84, y: 84, h: 22 };
const LAND = [
  { x: 14, y: 44, w: 14, d: 26, r: 6 },
  { x: 46, y: 12, w: 28, d: 12, r: 5 },
  { x: 46, y: 46, w: 26, d: 24, r: 9 },
  { x: 94, y: 46, w: 12, d: 26, r: 5 },
  { x: 46, y: 96, w: 26, d: 10, r: 5 },
];
// Which server each landmass sits closest to, in the order of LAND
const SERVED = [2, 0, 3, 1, 3];
const PERIOD = 8;
// Servers come on one after another, hold together, then go dark for a rest
const step = (index: number) => {
  const from = 8 + index * 14;
  return `@keyframes isometric227-on${index} { 0%, ${from}% { opacity: 0; } ${from + 7}%, 84% { opacity: 1; } 92%, 100% { opacity: 0; } }
.isometric227-on${index} { animation: isometric227-on${index} ${PERIOD}s ease-in-out infinite; }`;
};

const STYLES = `
${[0, 1, 2, 3].map(step).join("\n")}
.isometric227-still * { animation: none !important; }
.isometric227-still .isometric227-on { opacity: 1; }
@media (prefers-reduced-motion: reduce) {
  .isometric227-scene * { animation: none !important; }
  .isometric227-scene .isometric227-on { opacity: 1; }
}
`;

/** A server post standing on the plate, with vent slots, a status light on its front and a cap light on top. */
function Server({ at, paint, lamp, on }: { at: { x: number; y: number; h: number }; paint: Paint; lamp: string; on: string }) {
  const half = POST / 2;
  return (
    <>
      <Block faces={box(at.x - half, at.y - half, BASE, POST, POST, at.h)} paint={paint} />
      <g transform={onLeft(at.y + half)} className={paint.ink}>
        {[0, 1, 2].map((slot) => (
          <rect key={`slot-${slot}`} x={at.x - 3} y={-(BASE + at.h - 3) + slot * 3.4} width={6} height={1.6} rx={0.8} />
        ))}
        <circle cx={at.x - 1.8} cy={-(BASE + 3.4)} r={1.1} />
        <circle cx={at.x - 1.8} cy={-(BASE + 3.4)} r={1.1} className={cn(on, lamp)} />
      </g>
      <g transform={onTop(BASE + at.h)}>
        <circle cx={at.x} cy={at.y} r={2.4} className={paint.ink} />
        <circle cx={at.x} cy={at.y} r={2.4} className={cn(on, lamp)} />
      </g>
    </>
  );
}

export function Isometric227({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric227Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  // The light a server shows once it is on, and the class that fades it in at its turn
  const lamp = accent ? mine.base : body.ink;
  const on = (index: number) => `isometric227-on isometric227-on${index} opacity-0`;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric227-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-84 -14 168 132" aria-hidden="true" className="isometric227-scene size-full overflow-visible">
        {/* The world plate with its landmasses as low tiles */}
        <RoundBlock shape={roundBox(2, 2, 0, 116, 116, BASE, 58)} paint={body} />
        {LAND.map((land, index) => (
          <g key={`land-${land.x}-${land.y}`}>
            <RoundBlock shape={roundBox(land.x, land.y, BASE, land.w, land.d, 1.2, land.r)} paint={body} />
            <rect x={land.x} y={land.y} width={land.w} height={land.d} rx={land.r} transform={onTop(BASE + 1.2)} className={body.ink} />
            {/* The land a server covers takes a soft tint when that server comes on */}
            <g opacity={0.45}>
              <rect x={land.x} y={land.y} width={land.w} height={land.d} rx={land.r} transform={onTop(BASE + 1.2)} className={cn(on(SERVED[index] ?? 0), lamp)} />
            </g>
          </g>
        ))}
        {/* Back to front; the nearest server turns fully to the accent when its turn comes */}
        <Server at={A} paint={body} lamp={lamp} on={on(0)} />
        <Server at={B} paint={body} lamp={lamp} on={on(1)} />
        <Server at={D} paint={body} lamp={lamp} on={on(2)} />
        <Server at={NEAR} paint={body} lamp={lamp} on={on(3)} />
        <g className={on(3)}>
          <Server at={NEAR} paint={mine} lamp={accent ? mine.ink : body.ink} on="" />
        </g>
      </svg>
    </div>
  );
}
