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

interface Isometric186Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the bell, the second hand, the snooze button and one book with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric186Demo: Isometric186Props = {
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
// The phone stands on its bottom front edge and leans back onto the books
const LEAN = (28 * Math.PI) / 180;
const FOOT = { x: 14, y: 64, z: BASE };
const UP: Point = [0, -Math.sin(LEAN), Math.cos(LEAN)];
const BACK: Point = [0, -Math.cos(LEAN), -Math.sin(LEAN)];
const flat = ([x, y, z]: Point) => [(x - y) * C, (x + y) * S - z] as const;
/** The matrix that lays local (across, down) units onto the leaning plane `depth` behind the glass, starting `rise` up the phone. */
function plane(depth: number, rise: number) {
  const origin: Point = [FOOT.x, FOOT.y + UP[1] * rise + BACK[1] * depth, FOOT.z + UP[2] * rise + BACK[2] * depth];
  const [e, f] = flat(origin);
  const [m0, m1] = flat([1, 0, 0]);
  const [m2, m3] = flat([0, -UP[1], -UP[2]]);
  return `matrix(${[m0, m1, m2, m3, e, f].map((n) => n.toFixed(3)).join(" ")})`;
}
const GLASS = plane(0, TALL);
// Behind the glass the body is a stack of thin layers, far to near
const LAYERS = Array.from({ length: THICK }, (_, index) => THICK - index);
// The back of the phone rests on the top front edge of the book stack, this far up the phone
const TOUCH = 46;
const SHELF = { y: FOOT.y + UP[1] * TOUCH + BACK[1] * THICK, z: FOOT.z + UP[2] * TOUCH + BACK[2] * THICK };
const BOOK_H = (SHELF.z - BASE) / 4;
// Bottom to top; inset is how far the front of the book sits behind the top one
const BOOKS = [
  { x: 24, w: 72, d: 28, inset: 2 },
  { x: 30, w: 62, d: 25, inset: 1 },
  { x: 26, w: 68, d: 27, inset: 3 },
  { x: 32, w: 60, d: 24, inset: 0 },
];

const PERIOD = 8;
const DIAL = { x: W / 2, y: 58, r: 19 };
const BELL = "M0 0a1.3 1.3 0 0 1 1.3 1.3c3 0.8 4.4 3.2 4.4 6v2.4l1.5 2h-14.4l1.5 -2v-2.4c0 -2.8 1.4 -5.2 4.4 -6a1.3 1.3 0 0 1 1.3 -1.3Z";
// The bell swings out and settles while the alarm rings
const SWINGS = [0, 14, -14, 12, -12, 10, -10, 8, -8, 0];
const RING = SWINGS.map((angle, index) => `${2 + index * 5}% { transform: rotate(${angle}deg); }`).join(" ");
const HAND: Record<Palette, string> = { theme: "fill-foreground/50", light: "fill-zinc-950/50", dark: "fill-white/60", tone: "fill-white/80", glass: "fill-foreground/50" };

const STYLES = `
@keyframes isometric186-bell { 0% { transform: rotate(0deg); } ${RING} 100% { transform: rotate(0deg); } }
@keyframes isometric186-near { 0%, 50%, 100% { opacity: 0; } 5%, 21%, 37% { opacity: 1; } 13%, 29% { opacity: 0.35; } }
@keyframes isometric186-far { 0%, 50%, 100% { opacity: 0; } 9%, 25%, 41% { opacity: 1; } 17%, 33% { opacity: 0.35; } }
@keyframes isometric186-snooze { 0%, 46%, 57%, 100% { opacity: 1; } 51% { opacity: 0.5; } }
@keyframes isometric186-second { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.isometric186-bell { animation: isometric186-bell ${PERIOD}s ease-in-out infinite; }
.isometric186-near { animation: isometric186-near ${PERIOD}s ease-in-out infinite; }
.isometric186-far { animation: isometric186-far ${PERIOD}s ease-in-out infinite; }
.isometric186-snooze { animation: isometric186-snooze ${PERIOD}s ease-in-out infinite; }
.isometric186-second { animation: isometric186-second 60s steps(60, end) infinite; }
.isometric186-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric186-scene * { animation: none !important; } }
`;

export function Isometric186({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric186Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  const signal = accent ? (palette === "tone" ? "stroke-white" : "stroke-current") : body.edge;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric186-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-82 -112 182 212" aria-hidden="true" className="isometric186-scene size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, 104, 84, BASE, 14)} paint={body} />
        {/* The book stack, bottom to top, with the page block showing on the open side */}
        {BOOKS.map((book, index) => {
          const y = SHELF.y - book.inset - book.d;
          const z = BASE + index * BOOK_H;
          return (
            <g key={`book-${book.x}-${book.w}`}>
              <Block faces={box(book.x, y, z, book.w, book.d, BOOK_H)} paint={index === 2 ? mine : body} />
              <g transform={onRight(book.x + book.w)}>
                <rect x={y + 2.5} y={-(z + BOOK_H - 2)} width={book.d - 2.5} height={BOOK_H - 4} className={index === 2 ? mine.ink : body.ink} />
              </g>
            </g>
          );
        })}
        {/* The phone, built from thin layers back to front */}
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
          {/* The bell swings from its top while sound waves pulse on both sides */}
          <g transform={`translate(${W / 2} 16)`}>
            {[1, -1].map((side) => (
              <g key={`waves-${side}`} transform={`scale(${side} 1)`} fill="none" strokeWidth={1.5} strokeLinecap="round" className={signal}>
                <path d="M11 4.5a6 6 0 0 1 0 7" className="isometric186-near" />
                <path d="M15 2.5a10 10 0 0 1 0 11" className="isometric186-far" />
              </g>
            ))}
            <g className="isometric186-bell">
              <path d={BELL} className={accent ? mine.base : body.base} />
              <circle cy={13.4} r={1.6} className={accent ? mine.base : body.base} />
            </g>
          </g>
          {/* The clock: seven o'clock, with the second hand ticking once a second */}
          <g transform={`translate(${DIAL.x} ${DIAL.y})`}>
            <circle r={DIAL.r} strokeWidth={0.9} className={cn(body.base, body.edge)} />
            {Array.from({ length: 12 }, (_, hour) => (
              <rect key={`tick-${hour}`} x={-0.6} y={-DIAL.r + 2} width={1.2} height={hour % 3 === 0 ? 4 : 2.4} rx={0.6} transform={`rotate(${hour * 30})`} className={body.ink} />
            ))}
            <rect x={-1.3} y={-10} width={2.6} height={11.3} rx={1.3} transform="rotate(210)" className={HAND[palette]} />
            <rect x={-1} y={-14.5} width={2} height={15.5} rx={1} className={HAND[palette]} />
            <g className="isometric186-second">
              <rect x={-0.5} y={-15.5} width={1} height={19.5} rx={0.5} className={accent ? mine.base : HAND[palette]} />
            </g>
            <circle r={1.9} className={accent ? mine.base : HAND[palette]} />
          </g>
          {/* Snooze, pressed once the alarm has rung, and stop */}
          <g className="isometric186-snooze">
            <rect x={8} y={84} width={W - 16} height={10.5} rx={5.25} className={accent ? mine.base : body.base} />
            <rect x={22} y={88} width={20} height={2.6} rx={1.3} className={accent ? mine.ink : body.ink} />
          </g>
          <rect x={8} y={98} width={W - 16} height={10.5} rx={5.25} className={body.base} />
          <rect x={25} y={102} width={14} height={2.6} rx={1.3} className={body.ink} />
        </g>
        {/* A low stop keeps the bottom edge from sliding forward */}
        <RoundBlock shape={roundBox(FOOT.x - 4, FOOT.y - 1, BASE, W + 8, 6, 4, 2.5)} paint={body} />
      </svg>
    </div>
  );
}
