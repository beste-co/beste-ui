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

interface Isometric26Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Light the block under the lens in the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric26Demo: Isometric26Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const COUNT = 4;
const TILE = 28;
const STEP = 34;
const THICKNESS = 10;
const DURATION = 6;
// The lens visits these tiles in order, a quarter of the loop each
const PATH = [
  [1, 1],
  [2, 1],
  [2, 2],
  [1, 2],
];
const TILES = Array.from({ length: COUNT * COUNT }, (_, index) => ({ i: index % COUNT, j: Math.floor(index / COUNT) })).sort(
  (a, b) => a.i + a.j - (b.i + b.j),
);

const LENS_Z = 34;
const RING_OUTER = 30;
const RING_INNER = 24;
const RING_DEPTH = 5;
// Held between the eye and the grid: shifted toward the viewer so the tile shows through the glass
const CENTER = PATH[0]![0]! * STEP + TILE / 2 + (LENS_Z + RING_DEPTH - THICKNESS - 6);
const ring = (outer: number, inner: number) =>
  `M${CENTER - outer} ${CENTER} a${outer} ${outer} 0 1 0 ${outer * 2} 0 a${outer} ${outer} 0 1 0 ${-outer * 2} 0 Z M${CENTER - inner} ${CENTER} a${inner} ${inner} 0 1 1 ${inner * 2} 0 a${inner} ${inner} 0 1 1 ${-inner * 2} 0 Z`;
const RING = ring(RING_OUTER, RING_INNER);
const HANDLE = box(CENTER + RING_OUTER - 2, CENTER - 4, LENS_Z, 36, 8, RING_DEPTH);

const offset = ([i, j]: number[]) => {
  const dx = (i! - PATH[0]![0]!) * STEP;
  const dy = (j! - PATH[0]![1]!) * STEP;
  return `translate(${((dx - dy) * C).toFixed(1)}px, ${((dx + dy) * S).toFixed(1)}px)`;
};

const STYLES = `
@keyframes isometric26-sweep { 0%, 18% { transform: ${offset(PATH[0]!)}; } 25%, 43% { transform: ${offset(PATH[1]!)}; } 50%, 68% { transform: ${offset(PATH[2]!)}; } 75%, 93% { transform: ${offset(PATH[3]!)}; } 100% { transform: ${offset(PATH[0]!)}; } }
@keyframes isometric26-glow { 0% { opacity: 0; } 5%, 18% { opacity: 1; } 24%, 100% { opacity: 0; } }
@keyframes isometric26-lift { 0% { transform: translateY(0); } 5%, 18% { transform: translateY(-4px); } 24%, 100% { transform: translateY(0); } }
.isometric26-lens { animation: isometric26-sweep ${DURATION}s cubic-bezier(0.45, 0, 0.25, 1) infinite; will-change: transform; }
.isometric26-glow { animation: isometric26-glow ${DURATION}s ease-in-out infinite both; }
.isometric26-lift { animation: isometric26-lift ${DURATION}s ease-in-out infinite both; }
.isometric26-still * { animation: none !important; }
.isometric26-still .isometric26-rest { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .isometric26-lens, .isometric26-glow, .isometric26-lift { animation: none; } .isometric26-rest { opacity: 1; } }
`;

export function Isometric26({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric26Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric26-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-122 -24 244 162" aria-hidden="true" className="size-full overflow-visible">
        {TILES.map(({ i, j }) => {
          const faces = box(i * STEP, j * STEP, 0, TILE, TILE, THICKNESS);
          const stop = PATH.findIndex(([pi, pj]) => pi === i && pj === j);
          if (stop < 0) return <Block key={`${i}-${j}`} faces={faces} paint={paint.body} />;
          const delay = { animationDelay: `${(stop * DURATION) / PATH.length}s` };
          return (
            <g key={`${i}-${j}`} className="isometric26-lift" style={delay}>
              <Block faces={faces} paint={paint.body} />
              {accent && (
                <polygon points={faces.top} className={cn("isometric26-glow opacity-0", stop === 0 && "isometric26-rest", paint.accent.base)} style={delay} />
              )}
            </g>
          );
        })}
        <g className="isometric26-lens">
          {Array.from({ length: RING_DEPTH }, (_, step) => (
            <g key={step} transform={onTop(LENS_Z + step)}>
              <path d={RING} fillRule="evenodd" className={paint.body.base} />
              <path d={RING} fillRule="evenodd" className={paint.body.right} />
            </g>
          ))}
          <g transform={onTop(LENS_Z + RING_DEPTH)}>
            <circle cx={CENTER} cy={CENTER} r={RING_INNER} className={cn("opacity-60", paint.body.ink)} />
            <path d={RING} fillRule="evenodd" strokeWidth={1} className={cn(paint.body.base, paint.body.edge)} />
          </g>
          <Block faces={HANDLE} paint={paint.body} />
        </g>
      </svg>
    </div>
  );
}
