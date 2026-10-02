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

interface Isometric128Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Light the switches with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  /** Breaker switches in each of the two rows. */
  count?: number;
  className?: string;
}

export const isometric128Demo: Isometric128Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
  count: 5,
};

const FLOOR = 8;
const WALL = 8;
const PANEL = { x: 16, z: 24, w: 60, d: 6, h: 68 };
const FRONT = WALL + PANEL.d;
const ROWS = [PANEL.z + 36, PANEL.z + 10];
const PITCH = 10;
const MODULE = 8;
const STEP = 5;
const START = 8;

function keyframes(index: number) {
  const on = START + index * STEP;
  return `
@keyframes isometric128-on${index} { 0%, ${on}% { opacity: 0; } ${on + 1}%, 88% { opacity: 1; } 92%, 100% { opacity: 0; } }
@keyframes isometric128-off${index} { 0%, ${on}% { opacity: 1; } ${on + 1}%, 88% { opacity: 0; } 92%, 100% { opacity: 1; } }
.isometric128-on${index} { animation: isometric128-on${index} 6s linear infinite; }
.isometric128-off${index} { animation: isometric128-off${index} 6s linear infinite; }`;
}

const STYLES = `${Array.from({ length: 10 }, (_, index) => keyframes(index)).join("")}
.isometric128-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric128-rest, .isometric128-off { animation: none !important; } }
`;

export function Isometric128({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, count = 5, className }: Isometric128Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const n = Math.min(5, Math.max(3, Math.round(count)));
  const left = PANEL.x + (PANEL.w - (n * PITCH - (PITCH - MODULE))) / 2;
  const doorEdge = body.ink.replace("fill-", "stroke-");

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric128-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-64 -113 145 195" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(0, 0, 0, 88, 68, FLOOR)} paint={body} />
        <Block faces={box(0, 0, FLOOR, 88, WALL, 100)} paint={body} />
        <Block faces={box(PANEL.x, WALL, PANEL.z, PANEL.w, PANEL.d, PANEL.h)} paint={body} />
        <g transform={onLeft(FRONT)} className={body.ink}>
          <rect x={PANEL.x + 4} y={-PANEL.z - PANEL.h + 4} width={PANEL.w - 8} height={PANEL.h - 8} rx={2} />
          {ROWS.map((z) => (
            <rect key={z} x={PANEL.x + 8} y={-z - 22} width={PANEL.w - 16} height={2} rx={1} />
          ))}
        </g>
        {ROWS.map((z, row) =>
          Array.from({ length: n }, (_, index) => {
            const x = left + index * PITCH;
            const order = (1 - row) * n + index;
            return (
              <g key={`${row}-${index}`}>
                <Block faces={box(x, FRONT, z, MODULE, 3, 18)} paint={body} />
                <g className={cn("opacity-0", `isometric128-off isometric128-off${order}`)}>
                  <Block faces={box(x + 1, FRONT + 3, z + 3, MODULE - 2, 3, 5)} paint={body} />
                </g>
                <g className={`isometric128-rest isometric128-on${order}`}>
                  <Block faces={box(x + 1, FRONT + 3, z + 10, MODULE - 2, 3, 5)} paint={paint.accent} />
                </g>
              </g>
            );
          }),
        )}
        <Block faces={box(PANEL.x - 4, FRONT, PANEL.z, 4, PANEL.w, PANEL.h)} paint={body} />
        <g transform={onRight(PANEL.x)}>
          <rect x={FRONT + 4} y={-PANEL.z - PANEL.h + 4} width={PANEL.w - 8} height={PANEL.h - 8} rx={2} fill="none" strokeWidth={2} className={doorEdge} />
          <rect x={FRONT + 12} y={-PANEL.z - PANEL.h + 14} width={PANEL.w - 24} height={30} rx={2} className={body.ink} />
          {[0, 1, 2].map((line) => (
            <rect key={line} x={FRONT + 16} y={-PANEL.z - PANEL.h + 20 + line * 7} width={line === 2 ? 14 : 20} height={2} rx={1} className={body.base} />
          ))}
        </g>
      </svg>
    </div>
  );
}
