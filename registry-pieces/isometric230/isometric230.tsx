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

interface Isometric230Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the climbing result and the first-place badge with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric230Demo: Isometric230Props = {
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
// The board stands across the desk; result cards hang on its front as thick tiles
const BOARD = { x: 12, y: 36, w: 110, d: 6, h: 88 };
const FACE = BOARD.y + BOARD.d;
const CARD = { x: 36, w: 78, d: 4, h: 16 };
const PITCH = 20;
const SLOT = (place: number) => BASE + 60 - place * PITCH;
const PULL = 7;
const PERIOD = 10;
const OUT = `${(-PULL * C).toFixed(2)}px`;
const DOWN = (PULL * S).toFixed(2);

const STYLES = `
@keyframes isometric230-climb { 0%, 12% { transform: translate(0px, 0px); } 18% { transform: translate(${OUT}, ${DOWN}px); } 40% { transform: translate(${OUT}, ${(PULL * S - 2 * PITCH).toFixed(2)}px); } 46%, 72% { transform: translate(0px, ${-2 * PITCH}px); } 78% { transform: translate(${OUT}, ${(PULL * S - 2 * PITCH).toFixed(2)}px); } 91% { transform: translate(${OUT}, ${DOWN}px); } 98%, 100% { transform: translate(0px, 0px); } }
@keyframes isometric230-yield { 0%, 20% { transform: translateY(0px); } 37%, 79% { transform: translateY(${PITCH}px); } 90%, 100% { transform: translateY(0px); } }
.isometric230-climb { animation: isometric230-climb ${PERIOD}s ease-in-out infinite; }
.isometric230-yield { animation: isometric230-yield ${PERIOD}s ease-in-out infinite; }
.isometric230-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric230-scene * { animation: none !important; } }
`;

/** One result: a thick tile on the board with a mark, a title and two lines on its face. */
function Result({ place, paint }: { place: number; paint: Paint }) {
  const z = SLOT(place);
  return (
    <>
      <Block faces={box(CARD.x, FACE, z, CARD.w, CARD.d, CARD.h)} paint={paint} />
      <g transform={onLeft(FACE + CARD.d)} className={paint.ink}>
        <circle cx={CARD.x + 7.5} cy={-(z + CARD.h / 2)} r={3.4} />
        <rect x={CARD.x + 14} y={-(z + 12.2)} width={30} height={3} rx={1.5} />
        <rect x={CARD.x + 14} y={-(z + 7.2)} width={56} height={2.2} rx={1.1} />
        <rect x={CARD.x + 14} y={-(z + 3.4)} width={40} height={2.2} rx={1.1} />
      </g>
    </>
  );
}

export function Isometric230({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric230Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric230-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-86 -82 210 204" aria-hidden="true" className="isometric230-scene size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, 134, 88, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(BOARD.x - 4, BOARD.y - 5, BASE, BOARD.w + 8, BOARD.d + 16, 2, 5)} paint={body} />
        <Block faces={box(BOARD.x, BOARD.y, BASE, BOARD.w, BOARD.d, BOARD.h)} paint={body} />
        <g transform={onLeft(FACE)}>
          {/* The search field across the top of the board */}
          <rect x={BOARD.x + 6} y={-(BASE + BOARD.h - 4)} width={BOARD.w - 12} height={8} rx={4} className={body.ink} />
          <circle cx={BOARD.x + 12} cy={-(BASE + BOARD.h - 8)} r={2} className={body.base} />
          <rect x={BOARD.x + 18} y={-(BASE + BOARD.h - 6.8)} width={34} height={2.4} rx={1.2} className={body.base} />
          {/* The places down the side: first place carries the accent */}
          {[0, 1, 2].map((place) => (
            <circle key={`place-${place}`} cx={BOARD.x + 12} cy={-(SLOT(place) + CARD.h / 2)} r={place === 0 ? 5 : 4} className={place === 0 ? mine.base : body.ink} />
          ))}
          <circle cx={BOARD.x + 12} cy={-(SLOT(0) + CARD.h / 2)} r={1.8} className={mine.ink} />
        </g>
        {/* The two results that give way move down a place */}
        <g className="isometric230-yield">
          <Result place={0} paint={body} />
          <Result place={1} paint={body} />
        </g>
        {/* The climbing result pulls out of third place, rises in front of the others and settles in first */}
        <g className="isometric230-climb">
          <Result place={2} paint={mine} />
        </g>
      </svg>
    </div>
  );
}
