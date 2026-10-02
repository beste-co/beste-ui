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

interface Isometric170Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Stripe the balloon with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric170Demo: Isometric170Props = {
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


const G = 8;
const SIZE = 100;
// The balloon hangs over this plan point, which projects to x = 0
const AT = 50;
const BASKET = { z: G + 66, w: 12, h: 9 };
const R = 47;
const TALL = 92;
const THROAT = 10;
const MOUTH_Y = AT - BASKET.z - BASKET.h - 10;
const TOP_Y = MOUTH_Y - TALL;
const RIM_Y = AT - BASKET.z - BASKET.h;
const STEPS = Array.from({ length: 41 }, (_, index) => index / 40);
/** Envelope radius at a height fraction t, 0 at the crown and 1 at the mouth: a round dome that tapers to the throat. */
const radius = (t: number) => (t <= 0.5 ? R * Math.sqrt(1 - (1 - 2 * t) ** 2) : THROAT + (R - THROAT) * (1 - (2 * t - 1) ** 1.7));
/** The strip of envelope between two meridians, in degrees from the one facing the viewer. */
function gore(from: number, to: number) {
  const edge = (degrees: number) => STEPS.map((t) => `${(radius(t) * Math.sin((degrees * Math.PI) / 180)).toFixed(1)},${(TOP_Y + TALL * t).toFixed(1)}`);
  return [...edge(from), ...edge(to).reverse()].join(" ");
}
const MERIDIANS = Array.from({ length: 8 }, (_, index) => -90 + (index * 180) / 7);
const MOUTH = radius(1);
const TREES: [number, number, number, number][] = [
  [14, 34, G, 0.9],
  [40, 10, G, 0.8],
  [14, 66, G + 6, 1],
  [26, 82, G + 6, 0.8],
  [86, 24, G, 0.9],
  [88, 86, G, 1.1],
];

function Tree({ x, y, z, size, paint }: { x: number; y: number; z: number; size: number; paint: Paint }) {
  const px = (x - y) * C;
  const py = (x + y) * S - z;
  const cone = (base: number, tip: number, half: number) => [`${px - half * size},${py - base * size} ${px + half * size},${py - base * size} ${px},${py - tip * size}`, `${px},${py - base * size} ${px + half * size},${py - base * size} ${px},${py - tip * size}`];
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <rect x={px - 1.5 * size} y={py - 5 * size} width={3 * size} height={5 * size} className={paint.ink} stroke="none" />
      {[cone(4, 17, 8), cone(11, 24, 6)].map(([whole, shade], index) => (
        <g key={index}>
          <polygon points={whole} className={paint.base} />
          <polygon points={shade} className={paint.right} stroke="none" />
        </g>
      ))}
    </g>
  );
}

const STYLES = `
@keyframes isometric170-drift { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
@keyframes isometric170-shadow { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(0.82); opacity: 0.55; } }
@keyframes isometric170-flame { 0%, 100% { transform: scaleY(0.75); opacity: 0.8; } 30% { transform: scaleY(1.1); opacity: 1; } 55% { transform: scaleY(0.85); opacity: 0.9; } 75% { transform: scaleY(1); opacity: 1; } }
@keyframes isometric170-cloud { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(10px); } }
.isometric170-drift { animation: isometric170-drift 7s ease-in-out infinite; will-change: transform; }
.isometric170-shadow { animation: isometric170-shadow 7s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.isometric170-flame { animation: isometric170-flame 0.7s ease-in-out infinite; transform-box: fill-box; transform-origin: center bottom; }
.isometric170-cloud { animation: isometric170-cloud 12s ease-in-out infinite; }
.isometric170-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric170-drift, .isometric170-shadow, .isometric170-flame, .isometric170-cloud { animation: none; } }
`;

export function Isometric170({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric170Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const stripe = paint.accent;
  const rope = body.ink.replace("fill-", "stroke-");
  const half = (BASKET.w / 2) * 2 * C;
  const far = TREES.filter(([x, y]) => x + y < 2 * AT);
  const near = TREES.filter(([x, y]) => x + y >= 2 * AT);

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric170-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-94 -152 188 258" aria-hidden="true" className="size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, SIZE, SIZE, G, 22)} paint={body} />
        <RoundBlock shape={roundBox(4, 56, G, 34, 38, 6, 14)} paint={body} />
        <g transform={onTop(G)} className={body.ink}>
          <ellipse cx={84} cy={70} rx={10} ry={8} />
          <rect x={62} y={30} width={22} height={3} rx={1.5} />
          <rect x={70} y={38} width={16} height={3} rx={1.5} />
        </g>
        {far.map(([x, y, z, size]) => (
          <Tree key={`${x}-${y}`} x={x} y={y} z={z} size={size} paint={body} />
        ))}
        <g transform={onTop(G)}>
          <circle cx={AT} cy={AT} r={18} className="isometric170-shadow fill-black/15" />
        </g>
        {near.map(([x, y, z, size]) => (
          <Tree key={`${x}-${y}`} x={x} y={y} z={z} size={size} paint={body} />
        ))}
        <g className="isometric170-cloud">
          <g className={body.edge} strokeWidth={1}>
            <rect x={-84} y={-66} width={34} height={12} rx={6} className={body.base} />
            <rect x={-76} y={-74} width={18} height={14} rx={7} className={body.base} />
            <rect x={-83} y={-65} width={32} height={10} rx={5} className={body.base} stroke="none" />
          </g>
        </g>
        <g className="isometric170-drift">
          <g className={rope} strokeWidth={1} strokeLinecap="round" fill="none">
            <line x1={0} y1={RIM_Y - BASKET.w / 2} x2={0} y2={MOUTH_Y} />
            <line x1={-half} y1={RIM_Y} x2={-MOUTH} y2={MOUTH_Y} />
            <line x1={half} y1={RIM_Y} x2={MOUTH} y2={MOUTH_Y} />
          </g>
          <polygon points={`-3,${RIM_Y - 1} 3,${RIM_Y - 1} 1.5,${MOUTH_Y + 3} 0,${MOUTH_Y - 1} -1.5,${MOUTH_Y + 3}`} className={cn("isometric170-flame", stripe === body ? body.ink : stripe.base)} />
          <Block faces={box(AT - BASKET.w / 2, AT - BASKET.w / 2, BASKET.z, BASKET.w, BASKET.w, BASKET.h)} paint={body} />
          <g transform={onLeft(AT + BASKET.w / 2)} className={body.ink}>
            <rect x={AT - 4} y={-(BASKET.z + 6)} width={8} height={1.5} />
            <rect x={AT - 4} y={-(BASKET.z + 3.5)} width={8} height={1.5} />
          </g>
          <line x1={0} y1={RIM_Y + BASKET.w / 2} x2={0} y2={MOUTH_Y} className={rope} strokeWidth={1} strokeLinecap="round" />
          <g className={body.edge} strokeWidth={1} strokeLinejoin="round">
            <polygon points={gore(-90, 90)} className={body.base} />
            {MERIDIANS.slice(0, -1).map((from, index) =>
              index % 2 === 0 ? <polygon key={from} points={gore(from, MERIDIANS[index + 1] ?? 90)} className={stripe.base} stroke="none" /> : null
            )}
            <polygon points={gore(MERIDIANS[4] ?? 0, 90)} className="fill-black/10" stroke="none" />
            <polygon points={gore(MERIDIANS[6] ?? 0, 90)} className="fill-black/10" stroke="none" />
            <polygon points={gore(-90, 90)} fill="none" />
            <rect x={-MOUTH - 1} y={MOUTH_Y - 3} width={2 * MOUTH + 2} height={5} rx={1.5} className={body.base} />
            <ellipse cx={0} cy={TOP_Y + 1.5} rx={7} ry={2.5} className={body.base} />
          </g>
        </g>
      </svg>
    </div>
  );
}
