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

interface Isometric85Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the car with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric85Demo: Isometric85Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

type Rod = ReturnType<typeof rod>;

/** A round rod lying along x or y from a to b, centered on (u, z) in the other two axes. */
function rod(axis: "x" | "y", a: number, b: number, u: number, z: number, r: number) {
  const at = (t: number, degrees: number): Point => {
    const angle = (degrees * Math.PI) / 180;
    const du = r * Math.cos(angle);
    const dz = r * Math.sin(angle);
    return axis === "x" ? [t, u + du, z + dz] : [u + du, t, z + dz];
  };
  const arc = (t: number, from: number, to: number) => Array.from({ length: 13 }, (_, k) => at(t, from + ((to - from) * k) / 12));
  const band = (from: number, to: number) => polygon([...arc(a, from, to), ...arc(b, from, to).reverse()]);
  return { axis, side: band(-45, 135), shade: band(-45, 45), cap: polygon(Array.from({ length: 36 }, (_, k) => at(b, k * 10))) };
}

function RodBlock({ shape, paint }: { shape: Rod; paint: Paint }) {
  const along = shape.axis === "y";
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <polygon points={shape.side} className={paint.base} />
      <polygon points={shape.shade} className={along ? paint.right : paint.left} stroke="none" />
      <polygon points={shape.cap} className={paint.base} />
      <polygon points={shape.cap} className={along ? paint.left : paint.right} stroke="none" />
    </g>
  );
}

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

const G = 8;
const FLOOR = box(0, 0, 0, 116, 84, G);
const WALL = box(0, 0, G, 116, 4, 40);
const LIFT = 22;
const POST = 64;
const FRAME_Z = G + LIFT;
const CAR_Z = FRAME_Z + 3;
const TOP_Z = CAR_Z + 12;
const ROOF_Z = TOP_Z + 14;
const X = 18;
const L = 82;
const Y = 28;
const W = 36;
const face = (points: Point[]) => polygon(points);
const CABIN = {
  top: face([[X + 26, Y + 3, ROOF_Z], [X + 50, Y + 3, ROOF_Z], [X + 50, Y + W - 3, ROOF_Z], [X + 26, Y + W - 3, ROOF_Z]]),
  front: face([[X + 50, Y + 3, ROOF_Z], [X + 62, Y + 3, TOP_Z], [X + 62, Y + W - 3, TOP_Z], [X + 50, Y + W - 3, ROOF_Z]]),
  side: face([[X + 16, Y + W - 3, TOP_Z], [X + 62, Y + W - 3, TOP_Z], [X + 50, Y + W - 3, ROOF_Z], [X + 26, Y + W - 3, ROOF_Z]]),
};
const WINDOWS = face([[X + 21, Y + W - 3, TOP_Z + 2], [X + 58, Y + W - 3, TOP_Z + 2], [X + 49, Y + W - 3, ROOF_Z - 2], [X + 27, Y + W - 3, ROOF_Z - 2]]);
const SCREEN = face([[X + 51, Y + 5, ROOF_Z - 1], [X + 61, Y + 5, TOP_Z + 1], [X + 61, Y + W - 5, TOP_Z + 1], [X + 51, Y + W - 5, ROOF_Z - 1]]);
const WHEELS = [X + 16, X + 66];
// Lowered, the lift arms rest on the floor
const RAISE = `translateY(${LIFT - 8}px)`;

const STYLES = `
@keyframes isometric85-lift { 0%, 10% { transform: ${RAISE}; } 44%, 84% { transform: translateY(0); } 100% { transform: ${RAISE}; } }
.isometric85-lift { animation: isometric85-lift 5.6s cubic-bezier(0.45, 0, 0.25, 1) infinite; will-change: transform; }
.isometric85-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric85-lift { animation: none; } }
`;

export function Isometric85({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric85Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const car = paint.accent;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric85-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-80 -64 184 164" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={FLOOR} paint={paint.body} />
        <Block faces={WALL} paint={paint.body} />
        <g transform={onLeft(4)} className={paint.body.ink}>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <rect key={index} x={10} y={-(G + 36) + index * 6} width={96} height={3} rx={1.5} />
          ))}
        </g>
        <g transform={onTop(G)} className={paint.body.ink}>
          <rect x={12} y={Y - 2} width={92} height={3} rx={1.5} />
          <rect x={12} y={Y + W - 1} width={92} height={3} rx={1.5} />
        </g>
        <Block faces={box(38, 12, G, 8, 8, POST)} paint={paint.body} />
        <g className="isometric85-lift">
          <Block faces={box(36, 20, FRAME_Z - 8, 12, 4, 10)} paint={paint.body} />
          <Block faces={box(38, 24, FRAME_Z, 40, 40, 3)} paint={paint.body} />
          {WHEELS.map((x) => (
            <RodBlock key={x} shape={rod("y", Y, Y + 6, x, CAR_Z + 3, 7)} paint={paint.body} />
          ))}
          <RoundBlock shape={roundBox(X, Y, CAR_Z, L, W, 12, 6)} paint={car} />
          <g transform={onRight(X + L)} className={car.ink}>
            <rect x={Y + 5} y={-(CAR_Z + 9)} width={6} height={3} rx={1.5} />
            <rect x={Y + W - 11} y={-(CAR_Z + 9)} width={6} height={3} rx={1.5} />
          </g>
          <g className={paint.body.edge} strokeWidth={1} strokeLinejoin="round">
            <polygon points={CABIN.top} className={paint.body.base} />
            <polygon points={CABIN.front} className={paint.body.base} />
            <polygon points={CABIN.front} className={paint.body.right} stroke="none" />
            <polygon points={CABIN.side} className={paint.body.base} />
            <polygon points={CABIN.side} className={paint.body.left} stroke="none" />
          </g>
          <polygon points={WINDOWS} className={paint.body.ink} />
          <polygon points={SCREEN} className={paint.body.ink} />
          {WHEELS.map((x) => (
            <RodBlock key={x} shape={rod("y", Y + W - 4, Y + W + 2, x, CAR_Z + 3, 7)} paint={paint.body} />
          ))}
          <g transform={onLeft(Y + W + 2)} className={paint.body.ink}>
            {WHEELS.map((x) => (
              <circle key={x} cx={x} cy={-(CAR_Z + 3)} r={3} />
            ))}
          </g>
          <Block faces={box(36, 64, FRAME_Z - 8, 12, 4, 10)} paint={paint.body} />
        </g>
        <Block faces={box(38, 68, G, 8, 8, POST)} paint={paint.body} />
        <Block faces={box(38, 10, G + POST, 8, 68, 5)} paint={paint.body} />
        <g transform={onLeft(76)} className={paint.body.ink}>
          <rect x={40} y={-(G + POST - 6)} width={4} height={40} rx={2} />
        </g>
      </svg>
    </div>
  );
}
