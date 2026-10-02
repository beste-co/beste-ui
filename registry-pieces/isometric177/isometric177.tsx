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

interface Isometric177Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the card, the contactless waves and the reader's lights with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric177Demo: Isometric177Props = {
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
const FOOT = { x: 12, y: 46, z: BASE + 3 };
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
// Stroke for small glyphs that carry no tone
const GLYPH: Record<Palette, string> = { theme: "stroke-foreground/40", light: "stroke-zinc-950/40", dark: "stroke-white/40", tone: "stroke-white/50", glass: "stroke-foreground/40" };

const PERIOD = 8;
// The card reader beside the phone: a wedge whose keypad face slopes down toward the front
const READER = { x0: 92, x1: 120, y0: 30, y1: 60, back: BASE + 18, front: BASE + 8 };
const SLOPE = Math.hypot(READER.y1 - READER.y0, READER.back - READER.front);
const READER_TOP = polygon([[READER.x0, READER.y0, READER.back], [READER.x1, READER.y0, READER.back], [READER.x1, READER.y1, READER.front], [READER.x0, READER.y1, READER.front]]);
const READER_SIDE = polygon([[READER.x1, READER.y0, BASE], [READER.x1, READER.y1, BASE], [READER.x1, READER.y1, READER.front], [READER.x1, READER.y0, READER.back]]);
/** The matrix that lays flat units onto the reader's sloped face, across then down the slope. */
const KEYPAD = (() => {
  const [e, f] = flat([READER.x0, READER.y0, READER.back]);
  const [m0, m1] = flat([1, 0, 0]);
  const [m2, m3] = flat([0, (READER.y1 - READER.y0) / SLOPE, (READER.front - READER.back) / SLOPE]);
  return `matrix(${[m0, m1, m2, m3, e, f].map((n) => n.toFixed(3)).join(" ")})`;
})();
const KEYS = [0, 1, 2, 3].flatMap((row) => [0, 1, 2].map((col) => ({ key: `${row}-${col}`, x: 6.5 + col * 7.5, y: 15.5 + row * 4 })));
// Contactless waves leave the phone's edge toward the reader, in an upright plane between the two
const WAVE = { y: 42, x: 78, z: BASE + 46, radii: [8, 14, 20] };
const arc = (radius: number) => {
  const point = (degrees: number) => `${(WAVE.x + radius * Math.cos((degrees * Math.PI) / 180)).toFixed(2)} ${(-WAVE.z + radius * Math.sin((degrees * Math.PI) / 180)).toFixed(2)}`;
  return `M${point(8)}A${radius} ${radius} 0 0 1 ${point(78)}`;
};
const PULSES = [12, 23, 34];
const wave = (index: number) => {
  const stops = PULSES.map((start) => {
    const on = start + index * 2.4;
    return `${(on - 0.1).toFixed(1)}% { opacity: 0; } ${(on + 1.5).toFixed(1)}% { opacity: 1; } ${(on + 5).toFixed(1)}% { opacity: 0; }`;
  }).join(" ");
  return `@keyframes isometric177-wave${index} { 0% { opacity: 0; } ${stops} 100% { opacity: 0; } }
.isometric177-wave${index} { animation: isometric177-wave${index} ${PERIOD}s linear infinite; }`;
};
const CHECK = { x: W / 2, y: 84, r: 11 };
const ROUND = 2 * Math.PI * CHECK.r;
const TICK = 17.5;

const STYLES = `
${[0, 1, 2].map(wave).join("\n")}
@keyframes isometric177-hint { 0% { opacity: 0.9; } 8% { opacity: 0.4; } 16% { opacity: 0.9; } 24% { opacity: 0.4; } 32% { opacity: 0.9; } 40% { opacity: 0.4; } 46% { opacity: 0.9; } 50%, 94% { opacity: 0; } 100% { opacity: 0.9; } }
@keyframes isometric177-lit { 0%, 45% { opacity: 0; } 48%, 92% { opacity: 1; } 97%, 100% { opacity: 0; } }
@keyframes isometric177-round { 0%, 50% { stroke-dashoffset: ${ROUND.toFixed(1)}; } 58%, 92% { stroke-dashoffset: 0; } 97%, 100% { stroke-dashoffset: ${ROUND.toFixed(1)}; } }
@keyframes isometric177-tick { 0%, 58% { stroke-dashoffset: ${TICK}; } 63%, 92% { stroke-dashoffset: 0; } 95%, 100% { stroke-dashoffset: ${TICK}; } }
@keyframes isometric177-amount { 0%, 62% { opacity: 0; transform: translateY(3px); } 67%, 92% { opacity: 1; transform: translateY(0); } 97%, 100% { opacity: 0; transform: translateY(3px); } }
.isometric177-hint { animation: isometric177-hint ${PERIOD}s linear infinite; }
.isometric177-lit { animation: isometric177-lit ${PERIOD}s linear infinite; }
.isometric177-round { animation: isometric177-round ${PERIOD}s ease-in-out infinite; }
.isometric177-tick { animation: isometric177-tick ${PERIOD}s ease-out infinite; }
.isometric177-amount { animation: isometric177-amount ${PERIOD}s ease-out infinite; }
.isometric177-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric177-scene * { animation: none !important; } }
`;

export function Isometric177({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric177Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  const onMine = accent ? (palette === "tone" ? "stroke-current" : "stroke-white") : GLYPH[palette];
  const signal = accent ? (palette === "tone" ? "stroke-white" : "stroke-current") : GLYPH[palette];
  const lamp = accent ? mine.base : body.base;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric177-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-70 -116 192 216" aria-hidden="true" className="isometric177-scene size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={3} y={3} width={W - 6} height={TALL - 6} rx={7} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 132, 72, BASE, 14)} paint={body} />
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
          <g clipPath={`url(#${clipId})`}>
            <rect x={W / 2 - 10} y={16} width={20} height={3} rx={1.5} className={body.base} />
            {/* The payment card, with its chip, number and contactless mark */}
            <rect x={8} y={26} width={W - 16} height={30} rx={5} className={accent ? mine.base : body.base} />
            <rect x={13} y={33} width={9} height={7} rx={1.5} className={accent ? mine.ink : body.ink} />
            <g fill="none" strokeWidth={1.3} strokeLinecap="round" className={onMine}>
              <path d={`M${W - 22} 33.5q2 3 0 6`} />
              <path d={`M${W - 19} 32q3.2 4.5 0 9`} />
              <path d={`M${W - 16} 30.5q4.4 6 0 12`} />
            </g>
            {[0, 1, 2, 3].map((group) => (
              <rect key={group} x={13 + group * 9.5} y={47} width={7} height={2.4} rx={1.2} className={accent ? mine.ink : body.ink} />
            ))}
            {/* Before the tap, a line asks to hold the phone near the reader */}
            <rect x={W / 2 - 15} y={64} width={30} height={2.8} rx={1.4} className={cn("isometric177-hint opacity-0", body.base)} />
            {/* The check draws itself once the reader answers, then the amount appears */}
            <g fill="none" strokeLinecap="round" strokeLinejoin="round" className={signal}>
              <circle cx={CHECK.x} cy={CHECK.y} r={CHECK.r} strokeWidth={2} strokeDasharray={ROUND.toFixed(1)} transform={`rotate(-90 ${CHECK.x} ${CHECK.y})`} className="isometric177-round" />
              <path d={`M${CHECK.x - 5.5} ${CHECK.y + 0.5}l4 4l7.5 -8.5`} strokeWidth={2.2} strokeDasharray={TICK} className="isometric177-tick" />
            </g>
            <g className="isometric177-amount">
              <rect x={W / 2 - 13} y={101} width={26} height={4} rx={2} className={body.base} />
              <rect x={W / 2 - 8} y={108} width={16} height={2.4} rx={1.2} className={body.base} opacity={0.6} />
            </g>
          </g>
        </g>
        {/* The lip of the stand holds the bottom edge of the phone */}
        <RoundBlock shape={roundBox(FOOT.x - 4, FOOT.y - 1, BASE + 3, W + 8, 6, 5, 2.5)} paint={body} />
        {/* The reader: front, side and the sloped keypad face with its display */}
        <g className={body.edge} strokeWidth={1} strokeLinejoin="round">
          <g transform={onLeft(READER.y1)}>
            <rect x={READER.x0} y={-READER.front} width={READER.x1 - READER.x0} height={READER.front - BASE} className={body.base} />
            <rect x={READER.x0} y={-READER.front} width={READER.x1 - READER.x0} height={READER.front - BASE} className={body.left} stroke="none" />
            <rect x={READER.x0 + 5} y={-BASE - 4.6} width={READER.x1 - READER.x0 - 10} height={1.6} rx={0.8} className={body.ink} stroke="none" />
          </g>
          <polygon points={READER_SIDE} className={body.base} />
          <polygon points={READER_SIDE} className={body.right} stroke="none" />
          <polygon points={READER_TOP} className={body.base} />
        </g>
        <g transform={KEYPAD}>
          <rect x={3} y={3} width={READER.x1 - READER.x0 - 6} height={8.5} rx={1.5} className={body.ink} />
          <g className="isometric177-lit">
            <rect x={3} y={3} width={READER.x1 - READER.x0 - 6} height={8.5} rx={1.5} className={lamp} />
            <path d="M10.5 7.4l2 2l4 -4.4" fill="none" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" className={onMine} />
          </g>
          {KEYS.map((key) => (
            <rect key={key.key} x={key.x} y={key.y} width={5} height={2.4} rx={1.2} className={body.ink} />
          ))}
          <circle cx={3.6} cy={21.5} r={1.2} className={body.ink} />
          <circle cx={3.6} cy={21.5} r={1.2} className={cn("isometric177-lit", lamp)} />
        </g>
        <g transform={onLeft(WAVE.y)} fill="none" strokeWidth={1.8} strokeLinecap="round" className={signal}>
          {WAVE.radii.map((radius, index) => (
            <path key={radius} d={arc(radius)} className={`isometric177-wave${index} opacity-0`} />
          ))}
        </g>
      </svg>
    </div>
  );
}
