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

interface Isometric238Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the switched-on toggles and the accept button with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric238Demo: Isometric238Props = {
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
const W = 96;
const TALL = 80;
const THICK = 5;
const FOOT = { x: 16, y: 44, z: BASE + 3 };

const flat = ([x, y, z]: Point) => [(x - y) * C, (x + y) * S - z] as const;
// Panels stand on their bottom front edge and lean back by this much
const LEAN = (14 * Math.PI) / 180;
const UP: Point = [0, -Math.sin(LEAN), Math.cos(LEAN)];
const BACK: Point = [0, -Math.cos(LEAN), -Math.sin(LEAN)];
/** The matrix that lays local (across, down) units onto a leaning plane `depth` behind a foot, starting `rise` up it. */
function plane(foot: { x: number; y: number; z: number }, depth: number, rise: number, left = 0) {
  const origin: Point = [foot.x + left, foot.y + UP[1] * rise + BACK[1] * depth, foot.z + UP[2] * rise + BACK[2] * depth];
  const [e, f] = flat(origin);
  const [m0, m1] = flat([1, 0, 0]);
  const [m2, m3] = flat([0, -UP[1], -UP[2]]);
  return `matrix(${[m0, m1, m2, m3, e, f].map((n) => n.toFixed(3)).join(" ")})`;
}
const FRONT = plane(FOOT, 0, TALL);
// Behind the front the slab is a stack of thin layers, far to near
const LAYERS = Array.from({ length: THICK }, (_, index) => THICK - index);
// The rest behind the slab: a little wider, half as tall
const REST = { side: 4, tall: 44, depth: 3 };
const REST_LAYERS = Array.from({ length: REST.depth }, (_, index) => THICK + REST.depth - index);
// The page leaves a chin at the bottom for the lip of the stand to cover
const PAGE = { x: 3, y: 12, w: W - 6, h: 57 };
// The consent banner rises from the bottom edge of the page
const BANNER = { x: 6, y: 31, w: W - 12 };
const HIDE = PAGE.y + PAGE.h - BANNER.y + 2;
const ROWS = [
  { key: "a", label: 28, at: 24 },
  { key: "b", label: 20, at: 32 },
  { key: "c", label: 32, at: 40 },
];
const SWITCH = { x: W - 25, w: 12, h: 5.4, travel: 6.6 };
const COOKIE = { x: 136, y: 50, r: 10, h: 3.5 };
const CHIPS = [
  [-4, -3],
  [3, -4.5],
  [5, 2],
  [-1.5, 4.5],
  [-6, 2.5],
  [0.5, -0.5],
] as const;

const PERIOD = 10;
const flip = (key: string, at: number) =>
  `@keyframes isometric238-knob${key} { 0%, ${at}% { transform: translateX(${-SWITCH.travel}px); } ${at + 4}%, 78% { transform: translateX(0px); } 80%, 100% { transform: translateX(${-SWITCH.travel}px); } }
@keyframes isometric238-on${key} { 0%, ${at}% { opacity: 0; } ${at + 4}%, 78% { opacity: 1; } 80%, 100% { opacity: 0; } }
.isometric238-knob${key} { animation: isometric238-knob${key} ${PERIOD}s ease-in-out infinite; }
.isometric238-on${key} { animation: isometric238-on${key} ${PERIOD}s ease-in-out infinite; }`;

const STYLES = `
@keyframes isometric238-banner { 0%, 8% { transform: translateY(${HIDE}px); } 18%, 64% { transform: translateY(0px); } 74%, 100% { transform: translateY(${HIDE}px); } }
@keyframes isometric238-press { 0%, 52%, 58%, 100% { transform: translateY(0px); } 54%, 56% { transform: translateY(0.9px); } }
.isometric238-banner { animation: isometric238-banner ${PERIOD}s cubic-bezier(0.3, 0, 0.2, 1) infinite; }
.isometric238-press { animation: isometric238-press ${PERIOD}s ease-in-out infinite; }
${ROWS.map((row) => flip(row.key, row.at)).join("\n")}
.isometric238-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric238-scene * { animation: none !important; } }
`;

export function Isometric238({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric238Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  const clipId = useId();

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric238-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-90 -76 236 210" aria-hidden="true" className="isometric238-scene size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={PAGE.x} y={PAGE.y} width={PAGE.w} height={PAGE.h} rx={4} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 156, 92, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(FOOT.x - 6, 14, BASE, W + 12, 44, 3, 8)} paint={body} />
        {/* The rest the slab leans against, then the slab itself, each built from thin layers back to front */}
        {REST_LAYERS.map((depth, index) => (
          <g key={`rest-${depth}`} transform={plane(FOOT, depth, REST.tall, -REST.side)} className={body.edge} strokeWidth={index === REST_LAYERS.length - 1 ? 1 : 0}>
            <rect width={W + 2 * REST.side} height={REST.tall} rx={6} className={body.base} />
            <rect width={W + 2 * REST.side} height={REST.tall} rx={6} className={index === REST_LAYERS.length - 1 ? body.left : body.right} stroke="none" />
          </g>
        ))}
        {LAYERS.map((depth) => (
          <g key={`slab-${depth}`} transform={plane(FOOT, depth, TALL)}>
            <rect width={W} height={TALL} rx={6} className={body.base} />
            <rect width={W} height={TALL} rx={6} className={body.right} />
          </g>
        ))}
        <g transform={FRONT}>
          <rect width={W} height={TALL} rx={6} strokeWidth={1} className={cn(body.base, body.edge)} />
          {[0, 1, 2].map((dot) => (
            <circle key={`dot-${dot}`} cx={7 + dot * 4.5} cy={6.5} r={1.4} className={body.ink} />
          ))}
          <rect x={24} y={3.8} width={W - 48} height={5.4} rx={2.7} className={body.ink} />
          <g clipPath={`url(#${clipId})`}>
            {/* The page under the banner */}
            <rect x={PAGE.x} y={PAGE.y} width={PAGE.w} height={PAGE.h} className={body.base} />
            <rect x={PAGE.x} y={PAGE.y} width={PAGE.w} height={PAGE.h} className={body.ink} />
            <rect x={9} y={17} width={36} height={4.4} rx={2.2} className={body.base} />
            <rect x={9} y={24} width={24} height={2.6} rx={1.3} className={body.base} />
            <rect x={55} y={16} width={32} height={22} rx={5} className={body.base} />
            {[9, 49].map((x) => (
              <rect key={`card-${x}`} x={x} y={42} width={38} height={22} rx={5} className={body.base} />
            ))}
            {/* The consent banner: three choices and one button */}
            <g className="isometric238-banner">
              <rect x={BANNER.x} y={BANNER.y} width={BANNER.w} height={HIDE + 6} rx={5} strokeWidth={0.9} className={cn(body.base, body.edge)} />
              <rect x={BANNER.x + 5} y={BANNER.y + 4} width={30} height={2.8} rx={1.4} className={body.ink} />
              <rect x={BANNER.x + 5} y={BANNER.y + 4} width={30} height={2.8} rx={1.4} className={body.ink} />
              {ROWS.map((row, index) => (
                <g key={`row-${row.key}`} transform={`translate(0 ${BANNER.y + 10.2 + index * 6.6})`}>
                  <rect x={BANNER.x + 5} y={1.6} width={row.label} height={2.2} rx={1.1} className={body.ink} />
                  <rect x={SWITCH.x} y={0} width={SWITCH.w} height={SWITCH.h} rx={SWITCH.h / 2} className={body.ink} />
                  <rect x={SWITCH.x} y={0} width={SWITCH.w} height={SWITCH.h} rx={SWITCH.h / 2} className={cn(`isometric238-on${row.key}`, accent ? mine.base : body.ink)} />
                  <circle cx={SWITCH.x + SWITCH.w - SWITCH.h / 2} cy={SWITCH.h / 2} r={SWITCH.h / 2 - 0.9} className={cn(`isometric238-knob${row.key}`, "fill-white")} />
                </g>
              ))}
              <g className="isometric238-press">
                <rect x={BANNER.x + 5} y={BANNER.y + 30.2} width={BANNER.w - 10} height={6.4} rx={3.2} className={accent ? mine.base : body.ink} />
                <rect x={W / 2 - 9} y={BANNER.y + 32.3} width={18} height={2.2} rx={1.1} className={accent ? mine.ink : body.base} />
              </g>
            </g>
          </g>
        </g>
        {/* The lip of the stand holds the bottom edge of the slab */}
        <RoundBlock shape={roundBox(FOOT.x - 4, FOOT.y - 1, BASE + 3, W + 8, 6, 5, 2.5)} paint={body} />
        {/* A cookie on the desk beside the stand */}
        <RoundBlock shape={roundBox(COOKIE.x - COOKIE.r, COOKIE.y - COOKIE.r, BASE, 2 * COOKIE.r, 2 * COOKIE.r, COOKIE.h, COOKIE.r)} paint={body} />
        <g transform={`${onTop(BASE + COOKIE.h)} translate(${COOKIE.x} ${COOKIE.y})`} className={body.ink}>
          {CHIPS.map(([x, y]) => (
            <circle key={`chip-${x}-${y}`} cx={x} cy={y} r={1.3} />
          ))}
        </g>
      </svg>
    </div>
  );
}
