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

interface Isometric89Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the featured coat with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric89Demo: Isometric89Props = {
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

const G = 6;
const Y = 28;
const RAIL_Z = G + 82;
const TOP_Z = RAIL_Z - 6;
const POST_TOP = RAIL_Z - 2;
// A hanger hook in (across, down) units from the collar: a stem and a loop around the rail, split at its top
const LOOP = 3.4;
const HOOK_NEAR = `M0 0V${-(6 - LOOP)}A${LOOP} ${LOOP} 0 0 0 ${LOOP} -6A${LOOP} ${LOOP} 0 0 0 0 ${-(6 + LOOP)}`;
const HOOK_FAR = `M0 ${-(6 + LOOP)}A${LOOP} ${LOOP} 0 0 0 ${-LOOP} -6V-4.5`;
const START = 10;
const END = 110;
// Garment outlines in (across, down) units from the collar
const SHAPES = {
  shirt: "M-6 0L-16 4L-20 24L-14 25L-13 13L-13 46L13 46L13 13L14 25L20 24L16 4L6 0Q0 5 -6 0Z",
  dress: "M-5 0L-12 3L-11 18L-19 54L19 54L11 18L12 3L5 0Q0 5 -5 0Z",
  coat: "M-6 0L-17 4L-21 40L-15 41L-14 16L-15 58L15 58L14 16L15 41L21 40L17 4L6 0Q0 5 -6 0Z",
};
const RACK: { shape: keyof typeof SHAPES; x: number; lit?: boolean }[] = [
  { shape: "shirt", x: 18 },
  { shape: "dress", x: 29 },
  { shape: "shirt", x: 40 },
  { shape: "dress", x: 51 },
  { shape: "shirt", x: 62 },
  { shape: "coat", x: 90, lit: true },
];
// Bunched up, the coat hangs this far back along the rail
const BUNCH = 17;
const BACK = `translate(${(-BUNCH * C).toFixed(1)}px, ${(-BUNCH * S).toFixed(1)}px)`;
const NUDGE = `translate(${(-3 * C).toFixed(1)}px, ${(-3 * S).toFixed(1)}px)`;

const STYLES = `
@keyframes isometric89-coat { 0%, 8% { transform: ${BACK}; } 34%, 78% { transform: translate(0, 0); } 96%, 100% { transform: ${BACK}; } }
@keyframes isometric89-nudge { 0%, 14% { transform: translate(0, 0); } 30% { transform: ${NUDGE}; } 44%, 100% { transform: translate(0, 0); } }
.isometric89-coat { animation: isometric89-coat 5.6s cubic-bezier(0.45, 0, 0.25, 1) infinite; will-change: transform; }
.isometric89-nudge { animation: isometric89-nudge 5.6s ease-in-out infinite; }
.isometric89-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric89-coat, .isometric89-nudge { animation: none; } }
`;

export function Isometric89({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric89Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const hook = paint.body.edge === "stroke-transparent" ? "stroke-white/60" : paint.body.edge;

  const slide = (item: (typeof RACK)[number], index: number) => ({
    className: item.lit ? "isometric89-coat" : "isometric89-nudge",
    style: item.lit ? undefined : { animationDelay: `${index * 0.06}s` },
  });
  const hooks = (d: string) =>
    RACK.map((item, index) => (
      <g key={item.x} {...slide(item, index)}>
        <g transform={`${onRight(item.x - 1)} translate(${Y} ${-TOP_Z})`}>
          <path d={d} fill="none" strokeWidth={1.5} strokeLinecap="round" vectorEffect="non-scaling-stroke" className={hook} />
        </g>
      </g>
    ));
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric89-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-50 -80 152 168" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(0, 10, 0, 120, 36, G)} paint={paint.body} />
        <Block faces={box(START - 4, Y - 14, G, 8, 28, 3)} paint={paint.body} />
        <RoundBlock shape={roundBox(START - 2.5, Y - 2.5, G + 3, 5, 5, POST_TOP - G - 3, 2.5)} paint={paint.body} />
        {/* Each hook loops over the rail: its far half goes behind the rail, its near half in front */}
        {hooks(HOOK_FAR)}
        {RACK.map((item, index) => {
          const garment = item.lit ? paint.accent : paint.body;
          return (
            <g key={item.x} {...slide(item, index)}>
              {[-2, -1, 0].map((offset) => (
                <g key={offset} transform={`${onRight(item.x + offset)} translate(${Y} ${-TOP_Z})`}>
                  <path d={SHAPES[item.shape]} className={garment.base} />
                  <path d={SHAPES[item.shape]} className={offset === 0 ? garment.right : garment.left} />
                  {offset === 0 && <path d={SHAPES[item.shape]} fill="none" strokeWidth={1} strokeLinejoin="round" vectorEffect="non-scaling-stroke" className={garment.edge} />}
                  {offset === 0 && item.shape === "coat" && <path d="M0 4L-5 16L0 30L5 16Z" className={garment.ink} />}
                </g>
              ))}
            </g>
          );
        })}
        <Block faces={box(END - 4, Y - 14, G, 8, 28, 3)} paint={paint.body} />
        <RoundBlock shape={roundBox(END - 2.5, Y - 2.5, G + 3, 5, 5, POST_TOP - G - 3, 2.5)} paint={paint.body} />
        {/* The rail lies across the tops of both posts */}
        <RodBlock shape={rod("x", START - 5, END + 5, Y, RAIL_Z, 2.5)} paint={paint.body} />
        {hooks(HOOK_NEAR)}
      </svg>
    </div>
  );
}
