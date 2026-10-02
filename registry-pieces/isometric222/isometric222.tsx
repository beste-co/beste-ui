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

interface Isometric222Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the selection frame, the check and one detail in each picture with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric222Demo: Isometric222Props = {
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
const PERIOD = 9;
const TILE = { size: 28, h: 4, z: BASE + 2 };
const COLS = [14, 48, 82];
const ROWS = [16, 50];
// Back row first, so nearer tiles draw over the ones behind them
const TILES = ROWS.flatMap((y, row) => COLS.map((x, col) => ({ x, y, id: row * 3 + col })));
// The tiles picked in turn, and when in the loop each one is held
const PICKS = [
  { id: 0, from: 6, to: 30 },
  { id: 4, from: 37, to: 61 },
  { id: 2, from: 68, to: 92 },
];

const STYLES = `
${PICKS.map(({ id, from, to }) => `@keyframes isometric222-lift${id} { 0%, ${from}% { transform: translateY(0px); } ${from + 5}%, ${to - 5}% { transform: translateY(-5px); } ${to}%, 100% { transform: translateY(0px); } }
@keyframes isometric222-mark${id} { 0%, ${from}% { opacity: 0; } ${from + 4}%, ${to - 4}% { opacity: 1; } ${to}%, 100% { opacity: 0; } }
.isometric222-lift${id} { animation: isometric222-lift${id} ${PERIOD}s ease-in-out infinite; }
.isometric222-mark${id} { animation: isometric222-mark${id} ${PERIOD}s ease-in-out infinite; }`).join("\n")}
.isometric222-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric222-scene * { animation: none !important; } }
`;

export function Isometric222({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric222Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  // A line drawn on top of an accent fill, and one drawn in the accent on a neutral fill
  const onAccent = accent ? (palette === "tone" ? "stroke-current" : "stroke-white") : body.edge;
  const inAccent = accent ? (palette === "tone" ? "stroke-white" : "stroke-current") : body.edge;

  /** The picture printed on a tile, drawn in a 22 unit square. */
  const art = (id: number) => {
    const spot = accent ? mine.base : body.base;
    if (id === 0 || id === 4)
      return (
        <>
          <circle cx={id === 0 ? 15.5 : 7} cy={7} r={3} className={spot} />
          <path d={id === 0 ? "M0 22V15L7 8L12 13L16 10L22 16V22Z" : "M0 22V12L5 16L12 7L22 17V22Z"} className={body.base} />
          <path d={id === 0 ? "M0 22V15L7 8L12 13L16 10L22 16V22Z" : "M0 22V12L5 16L12 7L22 17V22Z"} className={body.right} />
        </>
      );
    if (id === 1)
      return (
        <>
          <circle cx={9} cy={12} r={6.5} className={body.base} />
          <circle cx={15.5} cy={9} r={4} className={spot} />
        </>
      );
    if (id === 2)
      return (
        <>
          {[3, 8.5, 14].map((y, row) => (
            <rect key={`bar-${y}`} x={3} y={y} width={[16, 11, 14][row]} height={3.6} rx={1.8} className={row === 1 ? spot : body.base} />
          ))}
        </>
      );
    if (id === 3)
      return (
        <>
          <circle cx={11} cy={8.5} r={4} className={body.base} />
          <path d="M3 22C3 16 7 14 11 14C15 14 19 16 19 22Z" className={body.base} />
        </>
      );
    return (
      <>
        {[0, 1, 2, 3].map((cell) => (
          <rect key={`cell-${cell}`} x={3 + (cell % 2) * 8.5} y={3 + Math.floor(cell / 2) * 8.5} width={7.5} height={7.5} rx={2} className={cell === 3 ? spot : body.base} />
        ))}
      </>
    );
  };

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric222-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-92 -22 210 144" aria-hidden="true" className="isometric222-scene size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, 124, 94, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(8, 10, BASE, 108, 74, 2, 9)} paint={body} />
        {TILES.map(({ x, y, id }) => {
          const pick = PICKS.find((item) => item.id === id);
          return (
            <g key={`tile-${id}`} className={pick ? `isometric222-lift${id}` : undefined}>
              <RoundBlock shape={roundBox(x, y, TILE.z, TILE.size, TILE.size, TILE.h, 4)} paint={body} />
              <g transform={`${onTop(TILE.z + TILE.h)} translate(${x} ${y})`}>
                <rect x={3} y={3} width={22} height={22} rx={2.5} className={body.ink} />
                <g transform="translate(3 3)">{art(id)}</g>
                {/* The selection: a frame in the accent and a check in the corner */}
                {pick && (
                  <g className={cn(`isometric222-mark${id}`, id !== 0 && "opacity-0")}>
                    <rect x={0.9} y={0.9} width={TILE.size - 1.8} height={TILE.size - 1.8} rx={3.4} fill="none" strokeWidth={1.8} className={inAccent} />
                    <circle cx={22} cy={22} r={3.6} className={accent ? mine.base : body.base} />
                    <path d="M20.4 22.1L21.6 23.3L23.8 20.8" fill="none" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" className={onAccent} />
                  </g>
                )}
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
