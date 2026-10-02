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

interface Isometric247Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the share wedge, its coins and the page button with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric247Demo: Isometric247Props = {
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
const DESK = 160;
// The handed-over project: a small page slab standing at the back of the desk
const W = 52;
const TALL = 46;
const THICK = 4;
const LEAN = (14 * Math.PI) / 180;
const FOOT = { x: 7, y: 24, z: BASE + 3 };
const UP: Point = [0, -Math.sin(LEAN), Math.cos(LEAN)];
const BACK: Point = [0, -Math.cos(LEAN), -Math.sin(LEAN)];
const flat = ([x, y, z]: Point) => [(x - y) * C, (x + y) * S - z] as const;
/** The matrix that lays local (across, down) units onto the leaning plane `depth` behind the front, starting `rise` up the slab. */
function plane(depth: number, rise: number, left = 0) {
  const origin: Point = [FOOT.x + left, FOOT.y + UP[1] * rise + BACK[1] * depth, FOOT.z + UP[2] * rise + BACK[2] * depth];
  const [e, f] = flat(origin);
  const [m0, m1] = flat([1, 0, 0]);
  const [m2, m3] = flat([0, -UP[1], -UP[2]]);
  return `matrix(${[m0, m1, m2, m3, e, f].map((n) => n.toFixed(3)).join(" ")})`;
}
const LAYERS = Array.from({ length: THICK }, (_, index) => THICK - index);
const REST = { side: 3, tall: 24, depth: 3 };
const REST_LAYERS = Array.from({ length: REST.depth }, (_, index) => THICK + REST.depth - index);

// The subscription as a pie of five equal wedges; the one facing the viewer is the share
const PIE = { x: 76, y: 76, r: 46, h: 14 };
const TOP = BASE + PIE.h;
const SHARE = { from: 9, to: 81 };
const SEAMS = [153, 225, 297];
// The share slides out along its own radius, which on screen is straight down
const OUT = 10;
const DOWN = Math.SQRT1_2;
const rad = (degrees: number) => (degrees * Math.PI) / 180;
const rim = (angle: number, r: number, z: number): Point => [PIE.x + r * Math.cos(rad(angle)), PIE.y + r * Math.sin(rad(angle)), z];
const arc = (from: number, to: number, r: number, z: number) =>
  Array.from({ length: Math.round((to - from) / 3) + 1 }, (_, k) => rim(from + ((to - from) * k) / Math.round((to - from) / 3), r, z));
const HUB: Point = [PIE.x, PIE.y, TOP];
/** The outer wall of the pie between two angles. */
const wall = (from: number, to: number) => polygon([...arc(from, to, PIE.r, BASE), ...arc(from, to, PIE.r, TOP).reverse()]);
/** The flat face a cut leaves at one angle. */
const cut = (angle: number) => polygon([[PIE.x, PIE.y, BASE], rim(angle, PIE.r, BASE), rim(angle, PIE.r, TOP), HUB]);
const slice = (from: number, to: number) => polygon([HUB, ...arc(from, to, PIE.r, TOP)]);
/** The inset band each wedge carries on its top. */
const band = (from: number, to: number) => polygon([...arc(from + 9, to - 9, 37, TOP), ...arc(from + 9, to - 9, 30, TOP).reverse()]);
const WEDGES = [0, 1, 2, 3].map((index) => ({ from: 81 + index * 72, to: 153 + index * 72 }));

// The earnings: a stack of coins that rises out of a well in front of the share, one coin per turn
const TRAY = { at: 88, r: 15, rim: 4 };
const COIN = { r: 10, h: 3.4, count: 3 };
const WELL_Z = BASE + TRAY.rim;
const TRAY_AT = { x: PIE.x + TRAY.at * DOWN, y: PIE.y + TRAY.at * DOWN };
const WELL = { cx: (TRAY_AT.x - TRAY_AT.y) * C, cy: (TRAY_AT.x + TRAY_AT.y) * S - WELL_Z, a: (COIN.r + 1) * 1.2247 + 0.6, b: (COIN.r + 1) * 0.7071 + 0.4 };
// Everything above the front rim of the well: the part of the stack that has come out
const WELL_CLIP = `M${(WELL.cx - WELL.a).toFixed(1)} ${WELL.cy.toFixed(1)}v-40h${(2 * WELL.a).toFixed(1)}v40a${WELL.a.toFixed(1)} ${WELL.b.toFixed(1)} 0 0 1 ${(-2 * WELL.a).toFixed(1)} 0Z`;
// Sunk, the top coin sits a little below the rim
const SUNK = COIN.count * COIN.h + 1.5;

const PERIOD = 12;
const TURNS = [0, 1, 2];
const SHARE_FRAMES = TURNS.map((turn) => {
  const start = 4 + turn * 20;
  return `${start}% { transform: translateY(0px); } ${start + 5}%, ${start + 12}% { transform: translateY(${(OUT * DOWN).toFixed(2)}px); } ${start + 17}% { transform: translateY(0px); }`;
}).join(" ");
// The stack comes up one coin each time the share is out, and sinks back before the rest
const STACK_FRAMES = TURNS.map((turn) => {
  const start = 4 + turn * 20 + 5;
  return `${start}% { transform: translateY(${(SUNK - turn * COIN.h).toFixed(1)}px); } ${start + 5}% { transform: translateY(${(SUNK - 1.5 - (turn + 1) * COIN.h).toFixed(1)}px); }`;
}).join(" ");

const STYLES = `
@keyframes isometric247-share { 0% { transform: translateY(0px); } ${SHARE_FRAMES} 100% { transform: translateY(0px); } }
@keyframes isometric247-stack { 0% { transform: translateY(${SUNK}px); } ${STACK_FRAMES} 84% { transform: translateY(0px); } 93%, 100% { transform: translateY(${SUNK}px); } }
.isometric247-share { animation: isometric247-share ${PERIOD}s ease-in-out infinite; }
.isometric247-stack { animation: isometric247-stack ${PERIOD}s ease-in-out infinite; }
.isometric247-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric247-scene * { animation: none !important; } }
`;

export function Isometric247({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric247Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  const wellId = useId();

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric247-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-146 -52 292 220" aria-hidden="true" className="isometric247-scene size-full overflow-visible">
        <defs>
          <clipPath id={wellId}>
            <path d={WELL_CLIP} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, DESK, DESK, BASE, 16)} paint={body} />
        {/* The project that was handed over, on its stand at the back */}
        <RoundBlock shape={roundBox(FOOT.x - 5, 6, BASE, W + 10, 26, 3, 7)} paint={body} />
        {REST_LAYERS.map((depth, index) => (
          <g key={`rest-${depth}`} transform={plane(depth, REST.tall, -REST.side)} className={body.edge} strokeWidth={index === REST_LAYERS.length - 1 ? 1 : 0}>
            <rect width={W + 2 * REST.side} height={REST.tall} rx={5} className={body.base} />
            <rect width={W + 2 * REST.side} height={REST.tall} rx={5} className={index === REST_LAYERS.length - 1 ? body.left : body.right} stroke="none" />
          </g>
        ))}
        {LAYERS.map((depth) => (
          <g key={`slab-${depth}`} transform={plane(depth, TALL)}>
            <rect width={W} height={TALL} rx={5} className={body.base} />
            <rect width={W} height={TALL} rx={5} className={body.right} />
          </g>
        ))}
        <g transform={plane(0, TALL)}>
          <rect width={W} height={TALL} rx={5} strokeWidth={1} className={cn(body.base, body.edge)} />
          {[0, 1, 2].map((dot) => (
            <circle key={`dot-${dot}`} cx={5.5 + dot * 3.6} cy={5} r={1.1} className={body.ink} />
          ))}
          <rect x={18} y={3} width={W - 23} height={4} rx={2} className={body.ink} />
          <rect x={3} y={10} width={W - 6} height={TALL - 16} rx={3.5} className={body.ink} />
          <rect x={7} y={14.5} width={21} height={3.6} rx={1.8} className={body.base} />
          <rect x={7} y={20.5} width={15} height={2.4} rx={1.2} className={body.base} />
          <rect x={7} y={27} width={14} height={6} rx={3} className={accent ? mine.base : body.base} />
          <rect x={31} y={14} width={W - 38} height={20.5} rx={3} className={body.base} />
          <path d="M32.5 33l4 -5.5l3 3l2.5 -4l1.5 6.5Z" className={body.ink} />
        </g>
        <RoundBlock shape={roundBox(FOOT.x - 3, FOOT.y - 1, BASE + 3, W + 6, 5.5, 4.5, 2.5)} paint={body} />
        {/* The four wedges that stay: outer wall, the two faces the cut leaves, the top and its seams */}
        <g className={body.edge} strokeWidth={1} strokeLinejoin="round">
          <polygon points={wall(-45, SHARE.from)} className={body.base} />
          <polygon points={wall(-45, SHARE.from)} className={body.right} stroke="none" />
          <polygon points={wall(SHARE.to, 135)} className={body.base} />
          <polygon points={wall(SHARE.to, 135)} className={body.left} stroke="none" />
          <polygon points={cut(SHARE.to)} className={body.base} />
          <polygon points={cut(SHARE.to)} className={body.right} stroke="none" />
          <polygon points={cut(SHARE.from)} className={body.base} />
          <polygon points={cut(SHARE.from)} className={body.left} stroke="none" />
          <polygon points={slice(SHARE.to, SHARE.from + 360)} className={body.base} />
          {SEAMS.map((angle) => (
            <polyline key={`seam-${angle}`} points={polygon([HUB, rim(angle, PIE.r, TOP)])} fill="none" />
          ))}
          {WEDGES.map((wedge) => (
            <polygon key={`band-${wedge.from}`} points={band(wedge.from, wedge.to)} className={body.ink} stroke="none" />
          ))}
        </g>
        {/* The share: one wedge in five, drawn slid out and eased in and out by the loop */}
        <g transform={`translate(0 ${(OUT * DOWN).toFixed(2)})`} className="isometric247-share">
          <g className={mine.edge === "stroke-transparent" ? body.edge : mine.edge} strokeWidth={1} strokeLinejoin="round">
            <polygon points={wall(SHARE.from, 45)} className={mine.base} />
            <polygon points={wall(SHARE.from, 45)} className={mine.right} stroke="none" />
            <polygon points={wall(45, SHARE.to)} className={mine.base} />
            <polygon points={wall(45, SHARE.to)} className={mine.left} stroke="none" />
            <polygon points={slice(SHARE.from, SHARE.to)} className={mine.base} />
            <polygon points={band(SHARE.from, SHARE.to)} className={mine.ink} stroke="none" />
          </g>
        </g>
        {/* The coin tray: a low housing with a well, and the stack clipped to the well's rim so it rises out of it */}
        <RoundBlock shape={roundBox(TRAY_AT.x - TRAY.r, TRAY_AT.y - TRAY.r, BASE, 2 * TRAY.r, 2 * TRAY.r, TRAY.rim, TRAY.r)} paint={body} />
        <g transform={onTop(WELL_Z)}>
          <circle cx={TRAY_AT.x} cy={TRAY_AT.y} r={COIN.r + 1} className={body.ink} />
          <circle cx={TRAY_AT.x} cy={TRAY_AT.y} r={COIN.r + 1} className={body.ink} />
        </g>
        <g clipPath={`url(#${wellId})`}>
          <g className="isometric247-stack">
            {Array.from({ length: COIN.count }, (_, index) => (
              <g key={`coin-${index}`}>
                <RoundBlock shape={roundBox(TRAY_AT.x - COIN.r, TRAY_AT.y - COIN.r, WELL_Z + index * COIN.h, 2 * COIN.r, 2 * COIN.r, COIN.h, COIN.r)} paint={mine} />
                <circle cx={TRAY_AT.x} cy={TRAY_AT.y} r={COIN.r - 3.8} transform={onTop(WELL_Z + (index + 1) * COIN.h)} className={mine.ink} />
              </g>
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
