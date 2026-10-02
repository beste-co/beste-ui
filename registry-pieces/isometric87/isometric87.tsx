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

interface Isometric87Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the upholstery with the tone; off keeps the chair in the body color. The lamp light stays warm. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric87Demo: Isometric87Props = {
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


const G = 6;
// The chair lies along x with its head toward -x; it is cut into upright slices across its width
const YC = 46;
const HALF = 15;
// The headrest and the shell under the seat are narrower than the pads
const NARROW = 10;
const SLICES = Array.from({ length: 4 * HALF + 1 }, (_, index) => YC - HALF + index / 2);
const SEAT = { x: 46, w: 28, z: 22, h: 7 };
const HINGE_Z = SEAT.z + SEAT.h / 2;
const BACK = 34;
const LEG = 18;
// Lying back: the backrest leans this far from upright and the leg rest hangs this far below level
const LEAN = 44;
const HANG = 31;
const RECLINE = 24;
// The instrument tray swings on its own post beside the headrest, clear of the chair
const TRAY = { x: 6, y: 74, z: 40, post: 30 };
const LAMP = { x: 20, z: 86, r: 9 };
const POST = { x: 20, y: 12, top: 96 };
// The light is a cone from the mouth of the lamp down to a pool on the headrest
const POOL = { x: 16, z: 58, r: 14 };
const RING = Array.from({ length: 36 }, (_, index) => (index * 10 * Math.PI) / 180);
const flatPoint = ([x, y, z]: Point): [number, number] => [(x - y) * C, (x + y) * S - z];
const circle = (cx: number, z: number, r: number) => RING.map((t): Point => [cx + r * Math.sin(t), YC + r * Math.cos(t), z]);
function hull(points: [number, number][]) {
  const sorted = [...points].sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  const half = (list: [number, number][]) => {
    const out: [number, number][] = [];
    for (const point of list) {
      while (out.length >= 2) {
        const [ax, ay] = out[out.length - 2] ?? point;
        const [bx, by] = out[out.length - 1] ?? point;
        if ((bx - ax) * (point[1] - ay) - (by - ay) * (point[0] - ax) > 0) break;
        out.pop();
      }
      out.push(point);
    }
    return out.slice(0, -1);
  };
  return [...half(sorted), ...half(sorted.reverse())];
}
const BEAM = hull([...circle(LAMP.x, LAMP.z, LAMP.r - 2), ...circle(POOL.x, POOL.z, POOL.r)].map(flatPoint))
  .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
  .join(" ");
const BEAM_TOP = flatPoint([LAMP.x, YC, LAMP.z])[1];
const BEAM_END = flatPoint([POOL.x, YC, POOL.z])[1] + POOL.r * S;
// The lamp gives warm light whatever the tone, and its face shows as a lit lip under the dish
const LIGHT = "fill-amber-300";
const LIP = cylinder(LAMP.x, YC, LAMP.z - 1.5, 1.5, LAMP.r - 1.5);
const PERIOD = 8;

const STYLES = `
@keyframes isometric87-recline { 0%, 10% { transform: rotate(${RECLINE}deg); } 30%, 80% { transform: rotate(0deg); } 96%, 100% { transform: rotate(${RECLINE}deg); } }
@keyframes isometric87-lit { 0%, 34% { opacity: 0; } 36% { opacity: 1; } 38% { opacity: 0.4; } 41%, 74% { opacity: 1; } 77%, 100% { opacity: 0; } }
.isometric87-turn { animation: isometric87-recline ${PERIOD}s cubic-bezier(0.45, 0, 0.3, 1) infinite; }
.isometric87-lit { animation: isometric87-lit ${PERIOD}s linear infinite; }
.isometric87-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric87-turn, .isometric87-lit { animation: none; } }
`;

/** One upright slice of the chair: the seat with the backrest and leg rest turning about their hinges. */
function Slice({ y, paint, shell }: { y: number; paint: Paint; shell: Paint }) {
  const face = y === YC + HALF;
  const off = Math.abs(y - YC);
  const pad = (props: { x: number; y: number; width: number; height: number; rx: number }, tint?: string) => (
    <>
      <rect {...props} className={paint.base} />
      {tint && !face && <rect {...props} className={tint} />}
      {face && <rect {...props} className={paint.right} />}
      {face && <rect {...props} fill="none" strokeWidth={1} vectorEffect="non-scaling-stroke" className="stroke-black/10" />}
    </>
  );
  // Stitched seams run across the padding; each slice carries a small notch of them
  const seam = (x: number, top: number, along: boolean) => !face && <rect x={x} y={top} width={along ? 1 : 1.6} height={along ? 1.6 : 1} className="fill-black/15" />;
  return (
    <g transform={onLeft(y)}>
      {off <= NARROW && <rect x={SEAT.x + 5} y={-SEAT.z} width={SEAT.w - 10} height={4} className={shell.base} />}
      {off <= NARROW && <rect x={SEAT.x + 5} y={-SEAT.z} width={SEAT.w - 10} height={4} className={shell.right} />}
      <g transform={`translate(${SEAT.x + SEAT.w} ${-HINGE_Z}) rotate(${HANG})`}>
        <g className="isometric87-turn">
          {pad({ x: -3, y: -3.5, width: LEG + 3, height: 7, rx: 3.5 }, paint.left)}
          {seam(7, -3.5, true)}
        </g>
      </g>
      <g transform={`translate(${SEAT.x} ${-HINGE_Z}) rotate(${-LEAN})`}>
        <g className="isometric87-turn">
          {pad({ x: -4, y: -BACK, width: 8, height: BACK + 3, rx: 4 }, paint.left)}
          {seam(2.4, -12, false)}
          {seam(2.4, -22, false)}
          {off <= NARROW && pad({ x: -3, y: -BACK - 11, width: 8, height: 11, rx: 4 }, paint.ink)}
          {off <= 2 && <rect x={-1.5} y={-BACK - 2} width={3} height={4} className={shell.base} />}
        </g>
      </g>
      {pad({ x: SEAT.x - 2, y: -SEAT.z - SEAT.h, width: SEAT.w + 4, height: SEAT.h, rx: 3.5 })}
      {seam(SEAT.x + 9, -SEAT.z - SEAT.h, true)}
      {seam(SEAT.x + 18, -SEAT.z - SEAT.h, true)}
    </g>
  );
}

export function Isometric87({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric87Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const id = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const pad = paint.accent;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric87-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-80 -94 184 198" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <linearGradient id={`${id}-fall`} gradientUnits="userSpaceOnUse" x1={0} y1={BEAM_TOP} x2={0} y2={BEAM_END}>
            <stop offset="0%" stopColor="white" stopOpacity={0.5} />
            <stop offset="100%" stopColor="white" stopOpacity={0.1} />
          </linearGradient>
          <radialGradient id={`${id}-soft`}>
            <stop offset="0%" stopColor="white" />
            <stop offset="60%" stopColor="white" stopOpacity={0.7} />
            <stop offset="100%" stopColor="white" stopOpacity={0} />
          </radialGradient>
          <mask id={`${id}-beam`}>
            <polygon points={BEAM} fill={`url(#${id}-fall)`} />
          </mask>
          <mask id={`${id}-pool`}>
            <circle cx={POOL.x} cy={YC} r={POOL.r} fill={`url(#${id}-soft)`} />
          </mask>
        </defs>
        <Block faces={box(0, 0, 0, 112, 84, G)} paint={body} />
        <RoundBlock shape={cylinder(POST.x, POST.y, G, 2, 7)} paint={body} />
        <RoundBlock shape={cylinder(POST.x, POST.y, G + 2, POST.top - G - 2, 2.2)} paint={body} />
        <RoundBlock shape={cylinder(60, YC, G, 3, 18)} paint={body} />
        <RoundBlock shape={cylinder(60, YC, G + 3, SEAT.z - G - 3, 6)} paint={body} />
        {SLICES.map((y) => (
          <Slice key={y} y={y} paint={pad} shell={body} />
        ))}
        <Block faces={box(58, YC + HALF, SEAT.z + 2, 3, 3, 10)} paint={body} />
        <Block faces={box(50, YC + HALF - 1, SEAT.z + 12, 20, 5, 2.5)} paint={body} />
        <RoundBlock shape={cylinder(TRAY.post, TRAY.y, G, 2, 6)} paint={body} />
        <RoundBlock shape={cylinder(TRAY.post, TRAY.y, G + 2, TRAY.z - G - 3, 1.8)} paint={body} />
        <RodBlock shape={rod("x", TRAY.x + 8, TRAY.post + 1, TRAY.y, TRAY.z - 1.5, 1.6)} paint={body} />
        <Block faces={box(TRAY.x, TRAY.y - 8, TRAY.z, 18, 15, 2)} paint={body} />
        <g transform={onTop(TRAY.z + 2)} className={body.ink}>
          {[-5, -1.5, 2].map((dy) => (
            <rect key={dy} x={TRAY.x + 3} y={TRAY.y + dy} width={12} height={1.5} rx={0.75} />
          ))}
        </g>
        <g className="isometric87-lit">
          <g transform={onTop(POOL.z)}>
            <circle cx={POOL.x} cy={YC} r={POOL.r} mask={`url(#${id}-pool)`} className={cn(LIGHT, "opacity-60")} />
          </g>
          <polygon points={BEAM} mask={`url(#${id}-beam)`} className={LIGHT} />
          <polygon points={LIP.side} className={LIGHT} />
        </g>
        <RoundBlock shape={cylinder(LAMP.x, YC, LAMP.z, 4, LAMP.r)} paint={body} />
        <RoundBlock shape={cylinder(LAMP.x, YC, LAMP.z + 4, POST.top - LAMP.z - 6, 3)} paint={body} />
        <RodBlock shape={rod("y", POST.y, YC + 2, POST.x, POST.top, 2)} paint={body} />
        <g transform={onTop(LAMP.z + 4)}>
          <circle cx={LAMP.x + 5} cy={YC + 4} r={1.5} className={body.ink} />
          <circle cx={LAMP.x + 5} cy={YC + 4} r={1.5} className={cn("isometric87-lit", LIGHT)} />
        </g>
      </svg>
    </div>
  );
}
