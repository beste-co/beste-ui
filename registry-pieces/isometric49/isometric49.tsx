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

interface Isometric49Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Write the sum in the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric49Demo: Isometric49Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const W = 120;
const D = 8;
const Z = 24;
const H = 76;
const TOP = Z + H;
// Hand drawn strokes for "1 + 2 = 3" and an underline, in board units
const GLYPHS = [
  "M1 3L4.5 0V14",
  "M0 7H10M5 2V12",
  "M0 3.5C0 -0.5 9 -1 9 3.5C9 7 0 9.5 0 14H9.5",
  "M0 5H10M0 10H10",
  "M0 1C3 -1 8.5 0 8 3.5C7.5 6 5 6.5 3.5 6.5C6.5 6.5 9 8 8.5 11C8 14.5 2.5 15 0 12.5",
  "M-62 21C-40 19 -16 19 12 21",
];
const GLYPH_X = [26, 40, 56, 70, 86, 86];
const START = [6, 16, 26, 36, 46, 58];
const LINE_Y = -TOP + 18;

const SCRIBBLE: Record<Palette, string> = {
  theme: "stroke-foreground/15",
  light: "stroke-zinc-950/15",
  dark: "stroke-white/15",
  tone: "stroke-white/30",
};
const CHALK: Record<Palette, string> = {
  theme: "stroke-card",
  light: "stroke-white",
  dark: "stroke-zinc-800",
  tone: "stroke-current",
};

const STYLES = [
  ...START.map(
    (start, index) =>
      `@keyframes isometric49-g${index} { 0%, ${start}% { opacity: 0; } ${start + 5}%, 84% { opacity: 1; } 92%, 100% { opacity: 0; } }\n.isometric49-g${index} { animation: isometric49-g${index} 5.6s ease-out infinite both; }`,
  ),
  ".isometric49-still * { animation: none !important; }",
  `@media (prefers-reduced-motion: reduce) { ${START.map((_, index) => `.isometric49-g${index}`).join(", ")} { animation: none; } }`,
].join("\n");

export function Isometric49({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric49Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const chalk = !accent ? CHALK[palette] : palette === "tone" ? "stroke-white" : "stroke-current";

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric49-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-28 -108 152 184" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(6, -14, 0, 12, 36, 6)} paint={paint.body} />
        <Block faces={box(8, 1, 6, 8, 6, Z - 6)} paint={paint.body} />
        <Block faces={box(W - 18, -14, 0, 12, 36, 6)} paint={paint.body} />
        <Block faces={box(W - 16, 1, 6, 8, 6, Z - 6)} paint={paint.body} />
        <Block faces={box(0, 0, Z, W, D, H)} paint={paint.body} />
        <g transform={onLeft(D)}>
          <rect x={6} y={-TOP + 6} width={W - 12} height={H - 10} rx={2} className={paint.body.ink} />
          <g fill="none" strokeWidth={2} strokeLinecap="round" vectorEffect="non-scaling-stroke" className={SCRIBBLE[palette]}>
            <path d="M22 -50C30 -54 38 -46 46 -50S62 -54 70 -50" vectorEffect="non-scaling-stroke" />
            <path d="M22 -40C34 -44 44 -36 56 -40" vectorEffect="non-scaling-stroke" />
            <path d="M84 -50L96 -40M96 -50L84 -40" vectorEffect="non-scaling-stroke" />
          </g>
          <g fill="none" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" className={chalk}>
            {GLYPHS.map((glyph, index) => (
              <path key={glyph} d={glyph} transform={`translate(${GLYPH_X[index]} ${LINE_Y})`} vectorEffect="non-scaling-stroke" className={`isometric49-g${index}`} />
            ))}
          </g>
        </g>
        <Block faces={box(6, D, Z + 2, W - 12, 6, 4)} paint={paint.body} />
        <Block faces={box(20, D + 1, Z + 6, 22, 5, 6)} paint={paint.body} />
        <g transform={onTop(Z + 12)} className={paint.body.ink}>
          <rect x={20} y={D + 1} width={22} height={5} />
        </g>
        <Block faces={box(82, D + 2, Z + 6, 14, 3, 3)} paint={paint.body} />
      </svg>
    </div>
  );
}
