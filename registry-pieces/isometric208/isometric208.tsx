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

interface Isometric208Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color one signature element on each board with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric208Demo: Isometric208Props = {
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
const BOARD = { w: 56, t: 4, h: 70, plinth: 3 };
// Back to front; each board stands further left and nearer than the one behind it
const BOARDS = [
  { id: "soft", x: 60, y: 16 },
  { id: "sharp", x: 34, y: 38 },
  { id: "bold", x: 8, y: 60 },
] as const;
// Each board steps out to the right of the one in front of it
const STEP = 10;
const PERIOD = 12;
const step = (name: string, start: number) =>
  `@keyframes isometric208-${name} { 0%, ${start}% { transform: translate(0px, 0px); } ${start + 6}%, ${start + 22}% { transform: translate(${(STEP * C).toFixed(2)}px, ${(STEP * S).toFixed(2)}px); } ${start + 28}%, 100% { transform: translate(0px, 0px); } }
.isometric208-${name} { animation: isometric208-${name} ${PERIOD}s cubic-bezier(0.4, 0, 0.2, 1) infinite; }`;

const STYLES = `
${step("soft", 4)}
${step("sharp", 36)}
${step("bold", 68)}
.isometric208-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric208-scene * { animation: none !important; } }
`;

export function Isometric208({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric208Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric208-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-84 -62 218 186" aria-hidden="true" className="isometric208-scene size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, 140, 82, BASE, 14)} paint={body} />
        {BOARDS.map((board) => (
          <g key={`board-${board.id}`} className={`isometric208-${board.id}`}>
            <Block faces={box(board.x - 3, board.y - 3, BASE, BOARD.w + 6, BOARD.t + 6, BOARD.plinth)} paint={body} />
            <Block faces={box(board.x, board.y, BASE + BOARD.plinth, BOARD.w, BOARD.t, BOARD.h)} paint={body} />
            <g transform={`${onLeft(board.y + BOARD.t)} translate(${board.x} ${-(BASE + BOARD.plinth + BOARD.h)})`}>
              {/* Soft: round shapes, pills and generous corners */}
              {board.id === "soft" && (
                <>
                  <rect x={4} y={4} width={48} height={62} rx={8} className={body.ink} />
                  <circle cx={15} cy={15} r={6} className={accent ? mine.base : body.base} />
                  <rect x={25} y={11} width={21} height={3.6} rx={1.8} className={body.base} />
                  <rect x={25} y={17} width={14} height={2.6} rx={1.3} className={body.base} />
                  <rect x={9} y={26} width={38} height={15} rx={7.5} className={body.base} />
                  <rect x={9} y={45} width={17.5} height={15} rx={6} className={body.base} />
                  <rect x={29.5} y={45} width={17.5} height={15} rx={6} className={body.base} />
                </>
              )}
              {/* Sharp: hairlines, square corners and a column grid */}
              {board.id === "sharp" && (
                <>
                  <rect x={5} y={6} width={46} height={0.9} className={body.ink} />
                  <rect x={5} y={10} width={30} height={4.4} className={body.ink} />
                  <rect x={5} y={17} width={22} height={4.4} className={body.ink} />
                  <rect x={5} y={25} width={46} height={0.9} className={body.ink} />
                  <rect x={5} y={29} width={26} height={24} className={body.ink} />
                  {[30, 34, 38, 42, 46].map((y) => (
                    <rect key={`rule-${y}`} x={35} y={y} width={y === 46 ? 10 : 16} height={1.4} className={body.ink} />
                  ))}
                  <rect x={5} y={57} width={46} height={0.9} className={body.ink} />
                  <rect x={5} y={61} width={14} height={4.4} className={accent ? mine.base : body.ink} />
                </>
              )}
              {/* Bold: one large block of color and heavy bars */}
              {board.id === "bold" && (
                <>
                  <rect x={4} y={4} width={48} height={32} rx={2} className={accent ? mine.base : body.ink} />
                  <rect x={9} y={11} width={32} height={6.4} rx={1.2} className={accent ? mine.ink : body.base} />
                  <rect x={9} y={20.5} width={22} height={6.4} rx={1.2} className={accent ? mine.ink : body.base} />
                  <rect x={4} y={40} width={22.5} height={26} rx={2} className={body.ink} />
                  <rect x={29.5} y={40} width={22.5} height={11.5} rx={2} className={body.ink} />
                  <rect x={29.5} y={54.5} width={22.5} height={11.5} rx={2} className={body.ink} />
                </>
              )}
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
