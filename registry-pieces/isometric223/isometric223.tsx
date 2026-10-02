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

interface Isometric223Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the spark, the send button and the sun in the picture with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric223Demo: Isometric223Props = {
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
const PERIOD = 10;
const TILE = { x: 37, y: 8, size: 60, h: 5 };
const BAR = { x: 10, y: 74, w: 114, d: 18, h: 4 };
const TEXT = { x: 34, w: 50 };
const SEND = { x: 113, y: 83, r: 6 };
const SPARK = { x: 22, y: 83 };
const STAR = "M0 -7C1.3 -2.4 2.4 -1.3 7 0C2.4 1.3 1.3 2.4 0 7C-1.3 2.4 -2.4 1.3 -7 0C-2.4 -1.3 -1.3 -2.4 0 -7Z";
const SLICES = [0, 0.6, 1.2, 1.8, 2.4, 3];
// The coarse pass: a 4 by 4 grid of flat cells, row by row from the back
const CELLS = ["sky", "sky", "sun", "sky", "sky", "sky", "sky", "sky", "hill", "sky", "hill", "hill", "hill", "hill", "hill", "deep"];

const STYLES = `
@keyframes isometric223-type { 0%, 8% { transform: translate(${-TEXT.w}px, 0px); } 28%, 100% { transform: translate(0px, 0px); } }
@keyframes isometric223-prompt { 0%, 88% { opacity: 1; } 94%, 100% { opacity: 0; } }
@keyframes isometric223-press { 0%, 29%, 36%, 100% { transform: translateY(0px); } 32%, 33% { transform: translateY(1.5px); } }
@keyframes isometric223-coarse { 0%, 36% { opacity: 0; } 44%, 88% { opacity: 1; } 94%, 100% { opacity: 0; } }
@keyframes isometric223-fine { 0%, 52% { opacity: 0; } 64%, 88% { opacity: 1; } 94%, 100% { opacity: 0; } }
.isometric223-type { animation: isometric223-type ${PERIOD}s linear infinite; }
.isometric223-prompt { animation: isometric223-prompt ${PERIOD}s ease-in-out infinite; }
.isometric223-press { animation: isometric223-press ${PERIOD}s ease-in-out infinite; }
.isometric223-coarse { animation: isometric223-coarse ${PERIOD}s ease-in-out infinite; }
.isometric223-fine { animation: isometric223-fine ${PERIOD}s ease-in-out infinite; }
.isometric223-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric223-scene * { animation: none !important; } }
`;

export function Isometric223({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric223Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  // A line drawn on top of an accent fill
  const onAccent = accent ? (palette === "tone" ? "stroke-current" : "stroke-white") : body.edge;
  const pictureId = useId();
  const textId = useId();
  const spot = accent ? mine.base : body.base;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric223-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-98 -22 226 156" aria-hidden="true" className="isometric223-scene size-full overflow-visible">
        <defs>
          <clipPath id={pictureId}>
            <rect x={4} y={4} width={TILE.size - 8} height={TILE.size - 8} rx={3} />
          </clipPath>
          <clipPath id={textId}>
            <rect x={TEXT.x - 6} y={7.7} width={TEXT.w} height={2.6} rx={1.3} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 134, 100, BASE, 14)} paint={body} />
        {/* The image tile: an empty frame, then coarse cells, then the finished picture */}
        <RoundBlock shape={roundBox(TILE.x, TILE.y, BASE, TILE.size, TILE.size, TILE.h, 6)} paint={body} />
        <g transform={`${onTop(BASE + TILE.h)} translate(${TILE.x} ${TILE.y})`}>
          <rect x={4} y={4} width={TILE.size - 8} height={TILE.size - 8} rx={3} className={body.ink} />
          <path d="M19 38L27 28L32 34L36 30L42 38Z" className={body.base} />
          <circle cx={36} cy={23} r={2.6} className={body.base} />
          <g clipPath={`url(#${pictureId})`}>
            <g className="isometric223-coarse">
              <rect x={4} y={4} width={52} height={52} className={body.base} />
              {CELLS.map((kind, cell) => (
                <rect
                  key={`cell-${cell}`}
                  x={4 + (cell % 4) * 13}
                  y={4 + Math.floor(cell / 4) * 13}
                  width={13.2}
                  height={13.2}
                  className={kind === "sun" ? spot : kind === "sky" ? body.left : kind === "hill" ? body.ink : body.right}
                />
              ))}
            </g>
            <g className="isometric223-fine">
              <rect x={4} y={4} width={52} height={52} className={body.base} />
              <rect x={4} y={4} width={52} height={52} className={body.left} />
              <circle cx={38} cy={18} r={6} className={spot} />
              <path d="M4 56V36L18 24L28 34L36 28L56 44V56Z" className={body.base} />
              <path d="M4 56V36L18 24L28 34L36 28L56 44V56Z" className={body.ink} />
              <path d="M4 56V48L16 40L30 50L42 44L56 52V56Z" className={body.base} />
              <path d="M4 56V48L16 40L30 50L42 44L56 52V56Z" className={body.right} />
            </g>
          </g>
        </g>
        {/* The prompt bar: a spark mark, the line being typed and the send button */}
        <RoundBlock shape={roundBox(BAR.x, BAR.y, BASE, BAR.w, BAR.d, BAR.h, 9)} paint={body} />
        <g transform={`${onTop(BASE + BAR.h)} translate(${BAR.x} ${BAR.y})`}>
          <rect x={TEXT.x - 12} y={4.5} width={TEXT.w + 18} height={9} rx={4.5} className={body.ink} />
          <g clipPath={`url(#${textId})`} className="isometric223-prompt">
            <rect x={TEXT.x - 6} y={7.7} width={TEXT.w} height={2.6} rx={1.3} className={cn("isometric223-type", body.base)} />
          </g>
        </g>
        {/* The spark is cut from a thin sheet: the same star stacked a little higher each time */}
        {SLICES.map((lift, index) => (
          <g key={`spark-${lift}`} transform={`${onTop(BASE + BAR.h + lift)} translate(${SPARK.x} ${SPARK.y}) rotate(45)`}>
            <path d={STAR} className={mine.base} />
            {index < SLICES.length - 1 && <path d={STAR} className={mine.right} />}
          </g>
        ))}
        <g className="isometric223-press">
          <RoundBlock shape={roundBox(SEND.x - SEND.r, SEND.y - SEND.r, BASE + BAR.h, 2 * SEND.r, 2 * SEND.r, 2.5, SEND.r)} paint={mine} />
          <g transform={`${onTop(BASE + BAR.h + 2.5)} translate(${SEND.x} ${SEND.y})`} fill="none" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" className={onAccent}>
            <path d="M-2.4 0H2.4M0.4 -2L2.4 0L0.4 2" />
          </g>
        </g>
      </svg>
    </div>
  );
}
