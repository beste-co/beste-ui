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

interface Isometric129Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the paint with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric129Demo: Isometric129Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const FLOOR = 6;
const WALL = 8;
const HEIGHT = 100;
const PAINT = FLOOR + 6;
const DONE = { x: 8, w: 40, top: 90 };
const SLEEVE = { x: DONE.x + DONE.w, w: 36, r: 7 };
const RY = WALL + SLEEVE.r;
// One full stroke: the roller starts just above the skirting line and stops level with the finished patch
const HIGH = 92;
const LOW = PAINT + SLEEVE.r + 1;
const RISE = HIGH - LOW;
const FROM = (LOW - PAINT) / (HIGH - PAINT);
const AXLE = SLEEVE.x + SLEEVE.w;
const BEND = AXLE + 5;
const DROP = 8;
const OUT = RY + 12;
const GRIP = 24;
const TRAY = { x: 10, y: 34, w: 40, d: 24, h: 5 };

const STYLES = `
@keyframes isometric129-roll { 0% { transform: translateY(${RISE}px); opacity: 0; } 6% { transform: translateY(${RISE}px); opacity: 1; } 56%, 84% { transform: translateY(0); opacity: 1; } 94%, 100% { transform: translateY(0); opacity: 0; } }
@keyframes isometric129-paint { 0%, 6% { transform: scaleY(${FROM.toFixed(3)}); opacity: 1; } 56%, 84% { transform: scaleY(1); opacity: 1; } 94%, 100% { transform: scaleY(1); opacity: 0; } }
.isometric129-roller { animation: isometric129-roll 6s cubic-bezier(0.45, 0, 0.55, 1) infinite; will-change: transform, opacity; }
.isometric129-paint { transform-box: fill-box; transform-origin: center bottom; animation: isometric129-paint 6s cubic-bezier(0.45, 0, 0.55, 1) infinite; }
.isometric129-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric129-roller, .isometric129-paint { animation: none; } }
`;

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

/** An upright cylinder standing on plan point (cx, cy). */
const cylinder = (cx: number, cy: number, z: number, h: number, r: number) => roundBox(cx - r, cy - r, z, 2 * r, 2 * r, h, r);

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

/** A painted patch on the wall in (x, -z) units with a soft, uneven top edge. */
function ragged(x: number, w: number, top: number, seed: number) {
  const bumps = Math.round(w / 6);
  const step = w / bumps;
  let d = `M${x} ${-PAINT}V${-top}`;
  for (let index = 0; index < bumps; index++) {
    const lift = [2.5, 0.5, 3, 1, 2, 0][(index + seed) % 6] ?? 0;
    d += `Q${(x + step * (index + 0.5)).toFixed(1)} ${(-top - lift * 1.6).toFixed(1)} ${(x + step * (index + 1)).toFixed(1)} ${-top}`;
  }
  return `${d}V${-PAINT}Z`;
}

export function Isometric129({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric129Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const wet = paint.accent;
  const done = ragged(DONE.x, DONE.w + 2, DONE.top, 0);
  const fresh = ragged(SLEEVE.x, SLEEVE.w, HIGH - 2, 3);

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric129-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-60 -111 155 199" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(0, 0, 0, 104, 64, FLOOR)} paint={body} />
        <Block faces={box(0, 0, FLOOR, 104, WALL, HEIGHT)} paint={body} />
        <g transform={onLeft(WALL)}>
          <path d={done} className={wet.base} />
          <path d={done} className={wet.left} />
          <g className="isometric129-paint">
            <path d={fresh} className={wet.base} />
            <path d={fresh} className={wet.left} />
          </g>
        </g>
        <Block faces={box(TRAY.x, TRAY.y, FLOOR, TRAY.w, TRAY.d, TRAY.h)} paint={body} />
        <g transform={onTop(FLOOR + TRAY.h)}>
          <rect x={TRAY.x + 3} y={TRAY.y + 3} width={TRAY.w - 18} height={TRAY.d - 6} rx={2} className={wet.base} />
          {[0, 1, 2].map((index) => (
            <rect key={index} x={TRAY.x + TRAY.w - 13 + index * 4} y={TRAY.y + 4} width={2} height={TRAY.d - 8} rx={1} className={body.ink} />
          ))}
        </g>
        <g className="isometric129-roller">
          <RodBlock shape={rod("x", SLEEVE.x, AXLE, RY, HIGH, SLEEVE.r)} paint={wet} />
          <RodBlock shape={rod("x", AXLE, AXLE + 2, RY, HIGH, 4)} paint={body} />
          <RodBlock shape={rod("x", AXLE + 2, BEND + 1.5, RY, HIGH, 1.5)} paint={body} />
          <RoundBlock shape={cylinder(BEND, RY, HIGH - DROP, DROP, 1.5)} paint={body} />
          <RodBlock shape={rod("y", RY, OUT, BEND, HIGH - DROP, 1.5)} paint={body} />
          <RodBlock shape={rod("y", OUT, OUT + 4, BEND, HIGH - DROP, 2.5)} paint={body} />
          <RodBlock shape={rod("y", OUT + 4, OUT + 4 + GRIP, BEND, HIGH - DROP, 4)} paint={body} />
        </g>
      </svg>
    </div>
  );
}
