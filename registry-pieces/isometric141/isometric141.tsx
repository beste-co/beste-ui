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

interface Isometric141Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the stripes with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric141Demo: Isometric141Props = {
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

const PLINTH = 6;
const CUP = { x: 28, y: 34, r1: 14, r2: 19, h: 36 };
const RIM = PLINTH + CUP.h;
const rad = (deg: number) => (deg * Math.PI) / 180;
const rimPoint = (r: number, deg: number, z: number): Point => [CUP.x + r * Math.cos(rad(deg)), CUP.y + r * Math.sin(rad(deg)), z];
/** A slice of the tapered wall between two angles. */
const wall = (from: number, to: number) => {
  const angles = Array.from({ length: 9 }, (_, k) => from + ((to - from) * k) / 8);
  return polygon([...angles.map((a) => rimPoint(CUP.r1, a, PLINTH)), ...[...angles].reverse().map((a) => rimPoint(CUP.r2, a, RIM))]);
};
const SIDE = wall(-45, 135);
const LEFT = wall(45, 135);
const RIGHT = wall(-45, 45);
const STRIPES = [-45, -15, 15, 45, 75, 105].map((from) => ({ d: wall(from, from + 15), left: from >= 45 }));
const LIP = polygon(Array.from({ length: 36 }, (_, k) => rimPoint(CUP.r2, k * 10, RIM)));
const [TX, TY] = project([CUP.x, CUP.y, RIM]).split(",").map(Number) as [number, number];
// Popcorn heap in screen units around the rim center, back to front
const KERNELS = [
  [-6, -15, 5], [6, -16, 5],
  [-15, -9, 5], [0, -10, 5.5], [14, -10, 5],
  [-20, -3, 4.5], [-8, -4, 5.5], [7, -4, 5.5], [19, -2, 4.5],
  [-13, 3, 5], [1, 3, 5.5], [14, 4, 5],
] as const;
const POPS = [
  { x: -3, y: -24, r: 4.5 },
  { x: 11, y: -28, r: 4 },
  { x: -14, y: -22, r: 4 },
];
const TICKET = { x: 50, y: 28, w: 32, d: 20, h: 2 };

const STYLES = `
@keyframes isometric141-pop { 0%, 6% { transform: translateY(14px) scale(0.6); opacity: 0; } 10% { opacity: 1; } 24% { transform: translateY(-4px) scale(1); } 34% { transform: translateY(0) scale(1); opacity: 1; } 48%, 100% { transform: translateY(14px) scale(0.8); opacity: 0; } }
.isometric141-pop { animation: isometric141-pop 4.5s cubic-bezier(0.3, 0.7, 0.4, 1) infinite; transform-box: fill-box; transform-origin: center; }
.isometric141-pop:nth-child(2) { animation-delay: 0.6s; }
.isometric141-pop:nth-child(3) { animation-delay: 1.3s; }
.isometric141-still * { animation: none !important; }
.isometric141-still .isometric141-rest { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .isometric141-pop { animation: none; } .isometric141-rest { opacity: 1; } }
`;

export function Isometric141({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric141Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const stripe = paint.accent;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric141-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-51 -47 124 121" aria-hidden="true" className="size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, 88, 62, PLINTH, 14)} paint={body} />
        <g className={body.edge} strokeWidth={1} strokeLinejoin="round">
          <polygon points={SIDE} className={body.base} />
          {STRIPES.map((s) => (
            <polygon key={s.d} points={s.d} className={stripe.base} stroke="none" />
          ))}
          <polygon points={LEFT} className={body.left} stroke="none" />
          <polygon points={RIGHT} className={body.right} stroke="none" />
          <polygon points={SIDE} fill="none" />
          <polygon points={LIP} className={body.base} />
        </g>
        <g transform={`translate(${TX} ${TY})`}>
          <g>
            {POPS.map((pop) => (
              <g key={pop.x} className="isometric141-pop isometric141-rest opacity-0">
                <circle cx={pop.x} cy={pop.y} r={pop.r} strokeWidth={1} className={cn(body.base, body.edge)} />
                <circle cx={pop.x - 1} cy={pop.y - 1} r={pop.r * 0.45} className={body.ink} />
              </g>
            ))}
          </g>
          {KERNELS.map(([x, y, r]) => (
            <g key={`${x}-${y}`}>
              <circle cx={x} cy={y} r={r} strokeWidth={1} className={cn(body.base, body.edge)} />
              <circle cx={x + r * 0.3} cy={y + r * 0.3} r={r * 0.55} className={body.left} />
            </g>
          ))}
        </g>
        <Block faces={box(TICKET.x, TICKET.y, PLINTH, TICKET.w, TICKET.d, TICKET.h)} paint={body} />
        <g transform={onTop(PLINTH + TICKET.h)} className={body.ink}>
          {[2, 6, 10, 14].map((dy) => (
            <rect key={dy} x={TICKET.x + 22} y={TICKET.y + dy + 0.5} width={1.5} height={2.5} />
          ))}
          <rect x={TICKET.x + 4} y={TICKET.y + 5} width={14} height={3} rx={1} />
          <rect x={TICKET.x + 4} y={TICKET.y + 11} width={9} height={3} rx={1} />
          <rect x={TICKET.x + 26} y={TICKET.y + 5} width={3} height={10} rx={1} />
        </g>
      </svg>
    </div>
  );
}
