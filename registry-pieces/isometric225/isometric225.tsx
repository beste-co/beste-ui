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

interface Isometric225Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the language selector and the page button with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric225Demo: Isometric225Props = {
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
const THICK = 4;
// The page slabs stand on their bottom front edge and lean back by this much
const LEAN = (14 * Math.PI) / 180;
const FOOT = { x: 24, y: 46, z: BASE + 3 };
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
// Two more language versions stand behind the front page, fanned out to either side
const FAN = [
  { id: "far", depth: 18, rise: TALL + 12, left: 12 },
  { id: "mid", depth: 9, rise: TALL + 6, left: -12 },
];
// A slab further back meets the stand a little way up its own face
const foot = (depth: number) => depth * Math.tan(LEAN);
const PILL = { x: 41, y: 3.6, w: 15, h: 6.4, gap: 17 };
// Each language sets the same copy in lines of its own lengths
const COPY = [
  { id: "a", head: [40, 26], text: [36, 30, 22] },
  { id: "b", head: [32, 38], text: [28, 38, 34] },
  { id: "c", head: [44, 18], text: [38, 24, 30] },
];
const PERIOD = 12;

const STYLES = `
@keyframes isometric225-pick { 0%, 28% { transform: translate(0px, 0px); } 33%, 61% { transform: translate(${PILL.gap}px, 0px); } 66%, 94% { transform: translate(${PILL.gap * 2}px, 0px); } 100% { transform: translate(0px, 0px); } }
@keyframes isometric225-a { 0%, 28% { opacity: 1; } 33%, 94% { opacity: 0; } 100% { opacity: 1; } }
@keyframes isometric225-b { 0%, 28% { opacity: 0; } 33%, 61% { opacity: 1; } 66%, 100% { opacity: 0; } }
@keyframes isometric225-c { 0%, 61% { opacity: 0; } 66%, 94% { opacity: 1; } 100% { opacity: 0; } }
.isometric225-pick { animation: isometric225-pick ${PERIOD}s ease-in-out infinite; }
.isometric225-a { animation: isometric225-a ${PERIOD}s ease-in-out infinite; }
.isometric225-b { animation: isometric225-b ${PERIOD}s ease-in-out infinite; }
.isometric225-c { animation: isometric225-c ${PERIOD}s ease-in-out infinite; }
.isometric225-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric225-scene * { animation: none !important; } }
`;

export function Isometric225({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric225Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric225-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-88 -92 226 212" aria-hidden="true" className="isometric225-scene size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, 146, 88, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(FOOT.x - 17, 16, BASE, W + 34, 44, 3, 8)} paint={body} />
        {/* The other language versions, far to near, each a thin slab with a page of its own */}
        {FAN.map(({ id, depth, rise, left }) => (
          <g key={`fan-${id}`}>
            {LAYERS.map((layer) => (
              <g key={`fan-${id}-${layer}`} transform={plane(depth + layer, rise, left)}>
                <rect width={W} height={rise - foot(depth + layer)} rx={6} className={body.base} />
                <rect width={W} height={rise - foot(depth + layer)} rx={6} className={body.right} />
              </g>
            ))}
            <g transform={plane(depth, rise, left)}>
              <rect width={W} height={rise - foot(depth)} rx={6} strokeWidth={1} className={cn(body.base, body.edge)} />
              <rect x={3} y={3} width={W - 6} height={rise - foot(depth) - 6} rx={4} className={body.left} />
              {[8, 14, 20, 26].map((y) => (
                <g key={`fan-line-${id}-${y}`}>
                  <rect x={6} y={y} width={5} height={2.4} rx={1.2} className={body.ink} />
                  <rect x={W - 11} y={y} width={5} height={2.4} rx={1.2} className={body.ink} />
                </g>
              ))}
            </g>
          </g>
        ))}
        {LAYERS.map((layer) => (
          <g key={`slab-${layer}`} transform={plane(layer, TALL)}>
            <rect width={W} height={TALL} rx={6} className={body.base} />
            <rect width={W} height={TALL} rx={6} className={body.right} />
          </g>
        ))}
        <g transform={plane(0, TALL)}>
          <rect width={W} height={TALL} rx={6} strokeWidth={1} className={cn(body.base, body.edge)} />
          <rect x={6} y={5} width={18} height={3.6} rx={1.8} className={body.ink} />
          {/* The language switch: three pills, and the selector that slides between them */}
          {[0, 1, 2].map((index) => (
            <rect key={`pill-${index}`} x={PILL.x + index * PILL.gap} y={PILL.y} width={PILL.w} height={PILL.h} rx={PILL.h / 2} className={body.ink} />
          ))}
          <rect x={PILL.x} y={PILL.y} width={PILL.w} height={PILL.h} rx={PILL.h / 2} className={cn("isometric225-pick", accent ? mine.base : body.ink)} />
          {[0, 1, 2].map((index) => (
            <g key={`code-${index}`} className={body.base}>
              <rect x={PILL.x + index * PILL.gap + 3.6} y={PILL.y + 2.2} width={3.2} height={2} rx={1} />
              <rect x={PILL.x + index * PILL.gap + 8.2} y={PILL.y + 2.2} width={3.2} height={2} rx={1} />
            </g>
          ))}
          <rect x={3} y={13} width={W - 6} height={56} rx={4} className={body.ink} />
          {/* The copy, set once per language; only the lines change, the layout stays */}
          {COPY.map(({ id, head, text }) => (
            <g key={`copy-${id}`} className={cn(`isometric225-${id}`, id !== "a" && "opacity-0", body.base)}>
              {head.map((width, row) => (
                <rect key={`head-${id}-${row}`} x={9} y={19 + row * 6.4} width={width} height={4.4} rx={2.2} />
              ))}
              {text.map((width, row) => (
                <rect key={`text-${id}-${row}`} x={9} y={34.5 + row * 4.6} width={width} height={2.4} rx={1.2} />
              ))}
            </g>
          ))}
          <rect x={9} y={51} width={24} height={8} rx={4} className={accent ? mine.base : body.base} />
          <rect x={14.5} y={53.8} width={13} height={2.4} rx={1.2} className={accent ? mine.ink : body.ink} />
          <rect x={58} y={19} width={30} height={42} rx={5} className={body.base} />
          <circle cx={67} cy={29} r={3.4} className={body.ink} />
          <path d="M60 59V50L68 42L74 48L79 43L86 50V59Z" className={body.ink} />
        </g>
        {/* The lip of the stand holds the bottom edge of the front page */}
        <RoundBlock shape={roundBox(FOOT.x - 4, FOOT.y - 1, BASE + 3, W + 8, 6, 5, 2.5)} paint={body} />
      </svg>
    </div>
  );
}
