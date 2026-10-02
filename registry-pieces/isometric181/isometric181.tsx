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

interface Isometric181Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the route, the pin and the puck with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric181Demo: Isometric181Props = {
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
// The rest behind the phone: a little wider, half as tall
const REST = { side: 4, tall: 62, depth: 3 };
const REST_LAYERS = Array.from({ length: REST.depth }, (_, index) => THICK + REST.depth - index);
const BASE_W = 100;
// The map screen, in screen units: three by three blocks with roads between them
const SCREEN = { top: 30, bottom: TALL - 18 };
const COLS = [[5, 19], [25, 39], [45, 59]] as const;
const ROWS = [[31, 49], [55, 73], [79, 99]] as const;
// The route follows the roads from the start at the bottom to the destination at the top
const ROUTE = [[22, 96], [22, 76], [42, 76], [42, 51]] as const;
const LENGTH = ROUTE.reduce((sum, [x, y], index) => (index ? sum + Math.abs(x - (ROUTE[index - 1]?.[0] ?? x)) + Math.abs(y - (ROUTE[index - 1]?.[1] ?? y)) : 0), 0);
const END = ROUTE[ROUTE.length - 1] ?? [0, 0];
const DRIVE = { from: 8, to: 60 };
const PERIOD = 9;
// Where the puck is at each corner of the route, as offsets from the destination where it is drawn
const LEGS = ROUTE.map(([x, y], index) => {
  const done = ROUTE.slice(1, index + 1).reduce((sum, [px, py], leg) => sum + Math.abs(px - (ROUTE[leg]?.[0] ?? px)) + Math.abs(py - (ROUTE[leg]?.[1] ?? py)), 0);
  return { at: DRIVE.from + ((DRIVE.to - DRIVE.from) * done) / LENGTH, move: `translate(${x - END[0]}px, ${y - END[1]}px)` };
});
const DIST = { x: 26, w: 28, left: 3 };

const STYLES = `
@keyframes isometric181-route { 0%, ${DRIVE.from}% { stroke-dashoffset: ${LENGTH}; } ${DRIVE.to}%, 100% { stroke-dashoffset: 0; } }
@keyframes isometric181-puck { 0% { transform: ${LEGS[0]?.move}; } ${LEGS.map((leg) => `${leg.at.toFixed(1)}% { transform: ${leg.move}; }`).join(" ")} 100% { transform: translate(0px, 0px); } }
@keyframes isometric181-ring { 0% { transform: scale(0.6); opacity: 0.6; } 100% { transform: scale(1.8); opacity: 0; } }
@keyframes isometric181-dist { 0%, ${DRIVE.from}% { transform: scaleX(${(DIST.w / DIST.left).toFixed(2)}); } ${DRIVE.to}%, 100% { transform: scaleX(1); } }
@keyframes isometric181-pin { 0%, ${DRIVE.to - 4}% { transform: translateY(-16px); opacity: 0; } ${DRIVE.to - 3}% { opacity: 1; } ${DRIVE.to + 1}% { transform: translateY(0); opacity: 1; } ${DRIVE.to + 3}% { transform: translateY(-3px); } ${DRIVE.to + 5}%, 100% { transform: translateY(0); opacity: 1; } }
@keyframes isometric181-done { 0%, ${DRIVE.to + 5}% { opacity: 0; transform: scale(0.6); } ${DRIVE.to + 8}% { opacity: 1; transform: scale(1.1); } ${DRIVE.to + 10}%, 100% { opacity: 1; transform: scale(1); } }
@keyframes isometric181-clear { 0% { opacity: 0; } 4%, 92% { opacity: 1; } 98%, 100% { opacity: 0; } }
.isometric181-route { animation: isometric181-route ${PERIOD}s linear infinite; }
.isometric181-puck { animation: isometric181-puck ${PERIOD}s linear infinite; }
.isometric181-ring { animation: isometric181-ring 1.6s ease-out infinite; transform-box: fill-box; transform-origin: center; }
.isometric181-dist { animation: isometric181-dist ${PERIOD}s linear infinite; transform-box: fill-box; transform-origin: left center; }
.isometric181-pin { animation: isometric181-pin ${PERIOD}s ease-out infinite; }
.isometric181-done { animation: isometric181-done ${PERIOD}s ease-out infinite; transform-box: fill-box; transform-origin: center; }
.isometric181-clear { animation: isometric181-clear ${PERIOD}s linear infinite; }
.isometric181-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric181-scene * { animation: none !important; } }
`;

export function Isometric181({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric181Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const trim = paint.accent;
  const mark = accent ? (palette === "tone" ? "stroke-white" : "stroke-current") : body.edge;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric181-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-70 -116 166 210" aria-hidden="true" className="isometric181-scene size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={4} y={SCREEN.top} width={W - 8} height={SCREEN.bottom - SCREEN.top} rx={2} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, BASE_W, 72, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(FOOT.x - 6, 14, BASE, W + 12, 44, 3, 8)} paint={body} />

        {/* The rest the phone leans against, then the phone itself, each built from thin layers back to front */}
        {REST_LAYERS.map((depth, index) => (
          <g key={depth} transform={plane(depth, REST.tall, -REST.side)} className={body.edge} strokeWidth={index === REST_LAYERS.length - 1 ? 1 : 0}>
            <rect width={W + 2 * REST.side} height={REST.tall} rx={6} className={body.base} />
            <rect width={W + 2 * REST.side} height={REST.tall} rx={6} className={index === REST_LAYERS.length - 1 ? body.left : body.right} stroke="none" />
          </g>
        ))}
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
          {/* Turn card: an arrow, the distance left and a street line */}
          <rect x={6} y={13} width={W - 12} height={14} rx={4} className={body.base} />
          <path d="M12 23.5V18.5H18M15.6 16.1L18 18.5L15.6 20.9" fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={mark} />
          <rect x={DIST.x} y={16.5} width={DIST.w} height={2.6} rx={1.3} className={body.ink} />
          <rect x={DIST.x} y={16.5} width={DIST.left} height={2.6} rx={1.3} className={cn("isometric181-dist", accent ? trim.base : body.base)} />
          <rect x={DIST.x} y={21.5} width={16} height={2.2} rx={1.1} className={body.ink} />
          {/* The map: city blocks with roads between them, the route, the puck and the pin */}
          <g clipPath={`url(#${clipId})`}>
            {ROWS.flatMap(([top, bottom]) =>
              COLS.map(([left, right]) => <rect key={`${left}-${top}`} x={left} y={top} width={right - left} height={bottom - top} rx={2} className={cn(body.base, "opacity-40")} />),
            )}
            <rect x={27} y={57} width={10} height={14} rx={1.5} className={cn(body.base, "opacity-60")} />
            <g className="isometric181-clear">
              <polyline points={ROUTE.map(([x, y]) => `${x},${y}`).join(" ")} fill="none" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={LENGTH} className={cn("isometric181-route", mark)} />
              <circle cx={ROUTE[0][0]} cy={ROUTE[0][1]} r={2.2} className={body.base} />
              <g transform={`translate(${END[0]} ${END[1]})`}>
                <g className="isometric181-puck">
                  <circle r={5} className={cn("isometric181-ring opacity-0", accent ? trim.base : body.base)} />
                  <circle r={3.6} className={body.base} />
                  <circle r={2.2} className={accent ? trim.base : body.ink} />
                </g>
                <g className="isometric181-pin">
                  <path d="M0 -3C-4.4 -8.5 -5.5 -11 -5.5 -13A5.5 5.5 0 0 1 5.5 -13C5.5 -11 4.4 -8.5 0 -3Z" className={accent ? trim.base : body.base} />
                  <circle cy={-13} r={2} className={accent ? trim.ink : body.ink} />
                </g>
                <g className="isometric181-done">
                  <circle cx={9} cy={-14} r={4.4} strokeWidth={0.75} className={cn(body.base, body.edge)} />
                  <path d="M6.9 -14l1.6 1.7l3 -3.4" fill="none" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" className={mark} />
                </g>
              </g>
            </g>
          </g>
          {/* Arrival bar at the bottom */}
          <rect x={6} y={TALL - 15} width={W - 12} height={8} rx={4} className={body.base} />
          <circle cx={12} cy={TALL - 11} r={2} className={accent ? trim.base : body.ink} />
          <rect x={17} y={TALL - 12.2} width={20} height={2.4} rx={1.2} className={body.ink} />
        </g>
        {/* The lip of the stand holds the bottom edge of the phone */}
        <RoundBlock shape={roundBox(FOOT.x - 4, FOOT.y - 1, BASE + 3, W + 8, 6, 5, 2.5)} paint={body} />

      </svg>
    </div>
  );
}
