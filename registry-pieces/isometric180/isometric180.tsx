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

interface Isometric180Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the album cover, the progress and the earbuds with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric180Demo: Isometric180Props = {
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
const BASE_W = 130;
const CASE = { x: 100, y: 40, w: 22, d: 16 };
// The now-playing screen, in screen units
const SCREEN = { top: 14, bottom: TALL - 6 };
const COVER = { x: 10, y: 16, size: 44 };
const BARS = Array.from({ length: 9 }, (_, index) => ({ x: 10 + index * 5, tall: [7, 11, 5, 12, 8, 10, 6, 12, 9][index] ?? 8, beat: index % 4 }));
const TRACK = { x: 10, y: 96, w: 44, played: 26 };
const PERIOD = 8;
const NOTES = [
  { x: W + 8, y: 30, delay: 0 },
  { x: W + 16, y: 46, delay: -1.3 },
  { x: W + 6, y: 58, delay: -2.6 },
];

const STYLES = `
${[0, 1, 2, 3].map((beat) => `@keyframes isometric180-beat${beat} { 0%, 100% { transform: scaleY(${[0.35, 1, 0.6, 0.8][beat]}); } 50% { transform: scaleY(${[1, 0.4, 0.95, 0.3][beat]}); } }
.isometric180-beat${beat} { animation: isometric180-beat${beat} ${[0.7, 0.9, 0.55, 1.1][beat]}s ease-in-out infinite; transform-box: fill-box; transform-origin: center bottom; }`).join("\n")}
@keyframes isometric180-played { 0% { transform: scaleX(0); } 96%, 100% { transform: scaleX(${(TRACK.w / TRACK.played).toFixed(3)}); } }
@keyframes isometric180-knob { 0% { transform: translateX(${-TRACK.played}px); } 96%, 100% { transform: translateX(${TRACK.w - TRACK.played}px); } }
@keyframes isometric180-pause { 0%, 46% { opacity: 1; } 46.1%, 54% { opacity: 0; } 54.1%, 100% { opacity: 1; } }
@keyframes isometric180-play { 0%, 46% { opacity: 0; } 46.1%, 54% { opacity: 1; } 54.1%, 100% { opacity: 0; } }
@keyframes isometric180-press { 0%, 45%, 49%, 53%, 57%, 100% { transform: scale(1); } 47%, 55% { transform: scale(0.88); } }
@keyframes isometric180-note { 0% { transform: translateY(8px); opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { transform: translateY(-18px); opacity: 0; } }
.isometric180-played { animation: isometric180-played ${PERIOD}s linear infinite; transform-box: fill-box; transform-origin: left center; }
.isometric180-knob { animation: isometric180-knob ${PERIOD}s linear infinite; }
.isometric180-pause { animation: isometric180-pause ${PERIOD}s step-end infinite; }
.isometric180-play { animation: isometric180-play ${PERIOD}s step-end infinite; }
.isometric180-press { animation: isometric180-press ${PERIOD}s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.isometric180-note { animation: isometric180-note 3.9s ease-in-out infinite; }
.isometric180-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric180-scene * { animation: none !important; } }
`;

export function Isometric180({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric180Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const trim = paint.accent;
  const mark = accent ? (palette === "tone" ? "stroke-white" : "stroke-current") : body.edge;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric180-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-70 -116 190 216" aria-hidden="true" className="isometric180-scene size-full overflow-visible">
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
          {/* Album cover with a simple record mark, then the title and artist lines */}
          <rect x={COVER.x} y={COVER.y} width={COVER.size} height={COVER.size} rx={6} className={accent ? trim.base : body.base} />
          <circle cx={COVER.x + COVER.size / 2} cy={COVER.y + COVER.size / 2} r={14} className={accent ? trim.ink : body.ink} />
          <circle cx={COVER.x + COVER.size / 2} cy={COVER.y + COVER.size / 2} r={5} className={accent ? trim.base : body.base} />
          <rect x={10} y={65} width={30} height={3.4} rx={1.7} className={body.base} />
          <rect x={10} y={71} width={18} height={2.6} rx={1.3} className={body.ink} />
          {/* Equalizer bars, each on its own rhythm */}
          {BARS.map((bar) => (
            <rect key={bar.x} x={bar.x} y={91 - bar.tall} width={3} height={bar.tall} rx={1.5} className={cn(`isometric180-beat${bar.beat}`, body.base)} />
          ))}
          {/* Progress: the played part grows and the knob rides its end */}
          <rect x={TRACK.x} y={TRACK.y} width={TRACK.w} height={2} rx={1} className={body.ink} />
          <rect x={TRACK.x} y={TRACK.y} width={TRACK.played} height={2} rx={1} className={cn("isometric180-played", accent ? trim.base : body.base)} />
          <circle cx={TRACK.x + TRACK.played} cy={TRACK.y + 1} r={2.4} className={cn("isometric180-knob", body.base)} />
          {/* Transport: previous, play or pause, next */}
          <path d="M20 104v8l-6 -4ZM14 104v8h-1.6v-8Z" className={body.base} />
          <path d="M44 104v8l6 -4ZM50 104v8h1.6v-8Z" className={body.base} />
          <g className="isometric180-press">
            <circle cx={W / 2} cy={108} r={6.5} className={accent ? trim.base : body.base} />
            <g className={cn("isometric180-pause", accent ? trim.ink : body.ink)}>
              <rect x={W / 2 - 3} y={105} width={2} height={6} rx={0.6} />
              <rect x={W / 2 + 1} y={105} width={2} height={6} rx={0.6} />
            </g>
            <path d={`M${W / 2 - 2} 104.6v6.8l5.4 -3.4Z`} className={cn("isometric180-play opacity-0", accent ? trim.ink : body.ink)} />
          </g>
        </g>
        {/* The lip of the stand holds the bottom edge of the phone */}
        <RoundBlock shape={roundBox(FOOT.x - 4, FOOT.y - 1, BASE + 3, W + 8, 6, 5, 2.5)} paint={body} />
        {/* A few notes drift up beside the phone and fade */}
        <g transform={GLASS} fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={mark}>
          {NOTES.map((note) => (
            <g key={note.y} transform={`translate(${note.x} ${note.y})`}>
              <g className="isometric180-note" style={{ animationDelay: `${note.delay}s` }}>
                <path d="M0 0V-8L6 -9.5V-1.5" />
                <circle cx={-1.6} cy={0} r={1.6} />
                <circle cx={4.4} cy={-1.5} r={1.6} />
              </g>
            </g>
          ))}
        </g>
        {/* Earbuds in their open charging case beside the stand */}
        <RoundBlock shape={roundBox(CASE.x, CASE.y - 5, BASE + 3, CASE.w, 4, 13, 2)} paint={body} />
        <RoundBlock shape={roundBox(CASE.x, CASE.y, BASE, CASE.w, CASE.d, 8, 6)} paint={body} />
        <g transform={onTop(BASE + 8)} className={body.ink}>
          <rect x={CASE.x + 2.5} y={CASE.y + 2.5} width={CASE.w - 5} height={CASE.d - 5} rx={4} />
        </g>
        {[CASE.x + 6, CASE.x + CASE.w - 6].map((x) => (
          <g key={x}>
            <RoundBlock shape={roundBox(x - 2, CASE.y + CASE.d / 2 - 2, BASE + 7, 4, 4, 7, 2)} paint={body} />
            <RoundBlock shape={roundBox(x - 3.5, CASE.y + CASE.d / 2 - 3.5, BASE + 14, 7, 7, 4, 3.5)} paint={trim} />
          </g>
        ))}
      </svg>
    </div>
  );
}
