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

interface Isometric30Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the map pin with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric30Demo: Isometric30Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const GROUND = 6;
const PLOT = 28;
const STEP = 36;
const HEIGHTS = [
  [44, 34, 22],
  [30, 10, 14],
  [20, 16, 12],
];
const TARGET = { i: 1, j: 1 };
const BLOCKS = HEIGHTS.flatMap((column, i) => column.map((height, j) => ({ i, j, height }))).sort((a, b) => a.i + a.j - (b.i + b.j));
const BASE = box(0, 0, 0, 8 + STEP * 3, 8 + STEP * 3, GROUND);

const plot = (index: number) => 8 + index * STEP;
const TARGET_X = plot(TARGET.i) + PLOT / 2;
const TARGET_Y = plot(TARGET.j) + PLOT / 2;
const TARGET_Z = GROUND + HEIGHTS[TARGET.i]![TARGET.j]!;
const PIN_X = (TARGET_X - TARGET_Y) * C;
const PIN_Y = (TARGET_X + TARGET_Y) * S - TARGET_Z;

// Teardrop with its tip at the origin; the sides are tangent to the head circle
const PIN = "M0 0 L-9.8 -21 A11 11 0 1 1 9.8 -21 Z";
const RIPPLE = "M-14 0 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0 Z M-11 0 a11 11 0 1 1 22 0 a11 11 0 1 1 -22 0 Z";

const STYLES = `
@keyframes isometric30-drop {
  0% { transform: translateY(-60px); opacity: 0; animation-timing-function: cubic-bezier(0.5, 0, 1, 1); }
  10% { opacity: 1; }
  32% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.4, 1); }
  40% { transform: translateY(-10px); animation-timing-function: cubic-bezier(0.6, 0, 1, 1); }
  48%, 84% { transform: translateY(0); opacity: 1; }
  96% { transform: translateY(0); opacity: 0; }
  100% { transform: translateY(-60px); opacity: 0; }
}
@keyframes isometric30-ripple { 0%, 30% { transform: scale(0.4); opacity: 0; } 34% { transform: scale(0.5); opacity: 1; } 62%, 100% { transform: scale(1.5); opacity: 0; } }
@keyframes isometric30-shadow { 0% { transform: scale(0.3); opacity: 0; } 32%, 84% { transform: scale(1); opacity: 1; } 40% { transform: scale(0.8); } 96%, 100% { transform: scale(1); opacity: 0; } }
.isometric30-pin { animation: isometric30-drop 4.2s infinite both; will-change: transform, opacity; }
.isometric30-ripple { animation: isometric30-ripple 4.2s ease-out infinite both; transform-box: fill-box; transform-origin: center; }
.isometric30-shadow { animation: isometric30-shadow 4.2s ease-in-out infinite both; transform-box: fill-box; transform-origin: center; }
.isometric30-still * { animation: none !important; }
.isometric30-still .isometric30-ripple { opacity: 0; }
@media (prefers-reduced-motion: reduce) { .isometric30-pin, .isometric30-ripple, .isometric30-shadow { animation: none; } .isometric30-ripple { opacity: 0; } }
`;

export function Isometric30({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric30Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const pin = paint.accent;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric30-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-104 -58 208 176" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={BASE} paint={paint.body} />
        {BLOCKS.map(({ i, j, height }) => {
          const x = plot(i);
          const y = plot(j);
          const top = GROUND + height;
          const rows = Array.from({ length: Math.max(0, Math.floor((height - 8) / 9)) }, (_, row) => top - 8 - row * 9);
          const target = i === TARGET.i && j === TARGET.j;
          return (
            <g key={`${i}-${j}`}>
              <Block faces={box(x, y, GROUND, PLOT, PLOT, height)} paint={paint.body} />
              <g className={paint.body.ink}>
                <g transform={onLeft(y + PLOT)}>
                  {rows.flatMap((z) => [5, 13, 21].map((dx) => <rect key={`${z}-${dx}`} x={x + dx} y={-z} width={3} height={4} rx={0.5} />))}
                </g>
                <g transform={onRight(x + PLOT)}>
                  {rows.flatMap((z) => [5, 13, 21].map((dy) => <rect key={`${z}-${dy}`} x={y + dy} y={-z} width={3} height={4} rx={0.5} />))}
                </g>
              </g>
              {target && (
                <>
                  <g transform={`${onTop(TARGET_Z)} translate(${TARGET_X} ${TARGET_Y})`}>
                    <circle cx={0} cy={0} r={5} className={cn("isometric30-shadow", paint.body.ink)} />
                    <path d={RIPPLE} fillRule="evenodd" className={cn("isometric30-ripple opacity-0", accent ? paint.accent.base : paint.body.ink)} />
                  </g>
                  <g transform={`translate(${PIN_X.toFixed(1)} ${PIN_Y.toFixed(1)}) scale(1.2)`}>
                    <g className="isometric30-pin">
                      <g transform="translate(2.6 -1.5)">
                        <path d={PIN} className={pin.base} />
                        <path d={PIN} className={pin.right} />
                      </g>
                      <path d={PIN} strokeWidth={1} strokeLinejoin="round" className={cn(pin.base, pin.edge)} />
                      <circle cx={0} cy={-26} r={4.5} className={accent ? paint.body.base : paint.body.ink} />
                    </g>
                  </g>
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
