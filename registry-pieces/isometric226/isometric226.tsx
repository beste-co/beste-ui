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

interface Isometric226Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the row being read and the translated page details with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric226Demo: Isometric226Props = {
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
const SHEET = 4;
const LEFT = { x: 12, y: 14, w: 54, d: 78 };
const RIGHT = { x: 74, y: 14, w: 54, d: 78 };
// A tab on the far edge of each page says which language it is in
const TAB = { x: 8, w: 18, d: 6 };
const ROWS = [0, 1, 2, 3, 4];
const ROW_Y = (row: number) => 35 + row * 11;
const SOURCE = [38, 30, 40, 26, 34];
const TARGET = [28, 40, 24, 36, 30];
const PERIOD = 10;
// Each row takes its turn: it lights up, then the other page swaps its line
const START = (row: number) => 8 + row * 14;

const STYLES = `
${ROWS.map((row) => {
  const at = START(row);
  return `@keyframes isometric226-lit${row} { 0%, ${at - 4}% { opacity: 0; } ${at}%, ${at + 9}% { opacity: 1; } ${at + 13}%, 100% { opacity: 0; } }
@keyframes isometric226-old${row} { 0%, ${at + 2}% { opacity: 1; } ${at + 8}%, 88% { opacity: 0; } 95%, 100% { opacity: 1; } }
@keyframes isometric226-new${row} { 0%, ${at + 2}% { opacity: 0; } ${at + 8}%, 88% { opacity: 1; } 95%, 100% { opacity: 0; } }
.isometric226-lit${row} { animation: isometric226-lit${row} ${PERIOD}s ease-in-out infinite; }
.isometric226-old${row} { animation: isometric226-old${row} ${PERIOD}s ease-in-out infinite; }
.isometric226-new${row} { animation: isometric226-new${row} ${PERIOD}s ease-in-out infinite; }`;
}).join("\n")}
.isometric226-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric226-scene * { animation: none !important; } }
`;

export function Isometric226({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric226Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric226-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-98 -24 226 162" aria-hidden="true" className="isometric226-scene size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, 140, 106, BASE, 14)} paint={body} />
        {/* The source page: its rows light up one after another */}
        <Block faces={box(LEFT.x + TAB.x, LEFT.y - TAB.d + 2, BASE, TAB.w, TAB.d, SHEET)} paint={body} />
        <RoundBlock shape={roundBox(LEFT.x, LEFT.y, BASE, LEFT.w, LEFT.d, SHEET, 6)} paint={body} />
        <g transform={`${onTop(BASE + SHEET)} translate(${LEFT.x} 0)`}>
          <rect x={7} y={21} width={18} height={6} rx={3} className={body.ink} />
          <circle cx={44} cy={24} r={3} className={body.ink} />
          {ROWS.map((row) => (
            <g key={`source-${row}`}>
              <rect x={7} y={ROW_Y(row) + 0.5} width={SOURCE[row]} height={2.8} rx={1.4} className={body.ink} />
              <rect x={7} y={ROW_Y(row) + 5} width={(SOURCE[row] ?? 0) - 10} height={2.2} rx={1.1} className={body.ink} />
              <g className={`isometric226-lit${row} opacity-0`}>
                <rect x={4} y={ROW_Y(row) - 1.6} width={46} height={10} rx={3.5} className={mine.base} />
                <rect x={7} y={ROW_Y(row) + 0.5} width={SOURCE[row]} height={2.8} rx={1.4} className={mine.ink} />
                <rect x={7} y={ROW_Y(row) + 5} width={(SOURCE[row] ?? 0) - 10} height={2.2} rx={1.1} className={mine.ink} />
              </g>
            </g>
          ))}
        </g>
        {/* The translated page: each row swaps to a new line as its source lights up */}
        <Block faces={box(RIGHT.x + TAB.x, RIGHT.y - TAB.d + 2, BASE, TAB.w, TAB.d, SHEET)} paint={mine} />
        <RoundBlock shape={roundBox(RIGHT.x, RIGHT.y, BASE, RIGHT.w, RIGHT.d, SHEET, 6)} paint={body} />
        <g transform={`${onTop(BASE + SHEET)} translate(${RIGHT.x} 0)`}>
          <rect x={7} y={21} width={18} height={6} rx={3} className={mine.base} />
          <circle cx={44} cy={24} r={3} className={body.ink} />
          {ROWS.map((row) => (
            <g key={`target-${row}`}>
              <g className={`isometric226-old${row} opacity-0`}>
                <rect x={7} y={ROW_Y(row) + 0.5} width={SOURCE[row]} height={2.8} rx={1.4} className={body.ink} />
                <rect x={7} y={ROW_Y(row) + 5} width={(SOURCE[row] ?? 0) - 10} height={2.2} rx={1.1} className={body.ink} />
              </g>
              <g className={`isometric226-new${row}`}>
                <circle cx={8.6} cy={ROW_Y(row) + 1.9} r={1.6} className={mine.base} />
                <rect x={13} y={ROW_Y(row) + 0.5} width={TARGET[row]} height={2.8} rx={1.4} className={body.ink} />
                <rect x={7} y={ROW_Y(row) + 5} width={(TARGET[row] ?? 0) - 6} height={2.2} rx={1.1} className={body.ink} />
              </g>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
