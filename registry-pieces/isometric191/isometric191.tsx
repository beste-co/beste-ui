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
interface Isometric191Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the fingerprint and the unlocked check with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric191Demo: Isometric191Props = {
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
const LEAN = (24 * Math.PI) / 180;
const FOOT = { x: 18, y: 60, z: BASE + 3 };
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
// The block the phone leans on: its front top edge meets the back of the phone
const PROP = { h: 64, d: 16, side: 4 };
const PROP_Y = FOOT.y - PROP.h * Math.tan(LEAN) - THICK / Math.cos(LEAN);

const PERIOD = 8;
const LOCK = { x: W / 2, y: 50 };
const PAD = { x: W / 2, y: 84, r: 20 };
const CHECK = "M-4 0.4L-1.2 3.2L4.4 -3";
// Fingerprint ridges from the core outward, drawn around the pad's center
const RIDGES = [
  "M0 -1V8",
  "M-3.5 6V0a3.5 3.5 0 0 1 7 0V9",
  "M-7.5 10V0a7.5 7.5 0 0 1 15 0V5",
  "M-11.5 5V0a11.5 11.5 0 0 1 23 0V11",
  "M-15.5 8V0a15.5 15.5 0 0 1 31 0V7",
];

const ridge = (index: number) => {
  const from = 8 + index * 5;
  return `@keyframes isometric191-ridge${index} { 0%, ${from}% { stroke-dashoffset: 1; } ${from + 16}%, 94% { stroke-dashoffset: 0; } 95%, 100% { stroke-dashoffset: 1; } }
.isometric191-ridge${index} { stroke-dasharray: 1 2; animation: isometric191-ridge${index} ${PERIOD}s ease-in-out infinite; }`;
};

const STYLES = `
${RIDGES.map((_, index) => ridge(index)).join("\n")}
@keyframes isometric191-print { 0%, 86% { opacity: 1; } 92%, 96% { opacity: 0; } 100% { opacity: 1; } }
@keyframes isometric191-lock { 0%, 46% { opacity: 1; } 52%, 86% { opacity: 0; } 92%, 100% { opacity: 1; } }
@keyframes isometric191-done { 0%, 46% { opacity: 0; } 52%, 86% { opacity: 1; } 92%, 100% { opacity: 0; } }
@keyframes isometric191-check { 0%, 52% { stroke-dashoffset: 14; } 60%, 100% { stroke-dashoffset: 0; } }
.isometric191-print { animation: isometric191-print ${PERIOD}s linear infinite; }
.isometric191-lock { animation: isometric191-lock ${PERIOD}s linear infinite; }
.isometric191-done { animation: isometric191-done ${PERIOD}s linear infinite; }
.isometric191-check { stroke-dasharray: 14; animation: isometric191-check ${PERIOD}s ease-out infinite; }
.isometric191-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric191-scene * { animation: none !important; } }
`;

export function Isometric191({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric191Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  // A line drawn on top of an accent fill, and one drawn in the accent on a neutral fill
  const onAccent = accent ? (palette === "tone" ? "stroke-current" : "stroke-white") : body.edge;
  const inAccent = accent ? (palette === "tone" ? "stroke-white" : "stroke-current") : body.edge;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric191-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-82 -116 178 216" aria-hidden="true" className="isometric191-scene size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, 100, 84, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(FOOT.x - 8, 4, BASE, W + 16, 66, 3, 8)} paint={body} />
        {/* The block behind, then the phone leaning on it, built from thin layers back to front */}
        <RoundBlock shape={roundBox(FOOT.x - PROP.side, PROP_Y - PROP.d, BASE + 3, W + 2 * PROP.side, PROP.d, PROP.h, 4)} paint={body} />
        {LAYERS.map((depth) => (
          <g key={`layer-${depth}`} transform={plane(depth, TALL)}>
            <rect width={W} height={TALL} rx={9} className={body.base} />
            <rect width={W} height={TALL} rx={9} className={body.right} />
            {depth > 1 && depth < 5 && <rect x={W - 0.5} y={30} width={1.6} height={16} rx={0.8} className={body.ink} />}
          </g>
        ))}
        <g transform={GLASS}>
          <rect width={W} height={TALL} rx={9} strokeWidth={1} className={cn(body.base, body.edge)} />
          <rect x={3} y={3} width={W - 6} height={TALL - 6} rx={7} className={body.ink} />
          <rect x={W / 2 - 8} y={6.5} width={16} height={4} rx={2} className={body.ink} />
          {/* The lock screen: the time and the date */}
          <rect x={20} y={20} width={24} height={6} rx={3} className={body.base} />
          <rect x={24} y={30} width={16} height={2.6} rx={1.3} className={cn(body.base, "opacity-60")} />
          {/* The padlock gives way to a check once the print is read */}
          <g transform={`translate(${LOCK.x} ${LOCK.y})`}>
            <g className={cn("isometric191-lock opacity-0", body.base)}>
              <path fillRule="evenodd" d="M-4.4 -1v-2.8a4.4 4.4 0 0 1 8.8 0v2.8h-2.2v-2.8a2.2 2.2 0 0 0 -4.4 0v2.8Z" />
              <rect x={-6} y={-1.4} width={12} height={9.4} rx={2.6} />
            </g>
            <g transform="translate(0 2)" className="isometric191-done">
              <circle r={7} className={accent ? mine.base : body.base} />
              <path d={CHECK} fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={cn("isometric191-check", onAccent)} />
            </g>
          </g>
          {/* The sensor pad: faint ridges, and the same ridges drawing in from the core outward */}
          <g transform={`translate(${PAD.x} ${PAD.y})`} fill="none" strokeLinecap="round">
            <circle r={PAD.r} stroke="none" className={body.base} />
            <g transform="translate(0 1.6) scale(0.7)">
              <g strokeWidth={1.9} className={body.edge}>
                {RIDGES.map((d, index) => (
                  <path key={`ghost-${index}`} d={d} />
                ))}
              </g>
              <g strokeWidth={2.1} className={cn("isometric191-print", inAccent)}>
                {RIDGES.map((d, index) => (
                  <path key={`ridge-${index}`} d={d} pathLength={1} className={`isometric191-ridge${index}`} />
                ))}
              </g>
            </g>
          </g>
          <rect x={22} y={109} width={20} height={2.6} rx={1.3} className={cn(body.base, "opacity-60")} />
        </g>
        {/* The lip of the stand holds the bottom edge of the phone */}
        <RoundBlock shape={roundBox(FOOT.x - 4, FOOT.y - 1, BASE + 3, W + 8, 6, 5, 2.5)} paint={body} />
      </svg>
    </div>
  );
}
