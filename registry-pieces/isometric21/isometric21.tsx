"use client";

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

interface Isometric21Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the prompts and the cursor with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric21Demo: Isometric21Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const W = 150;
const T = 12;
const H = 96;
const BASE = 8;
const TOP = -(BASE + H);
const ROW = 14;
const FIRST = TOP + 31;
const OUTPUT = [84, 60, 92];
const PERIOD = 6;

const row = (index: number) => FIRST + index * ROW;
const chevron = (y: number) => `12,${y - 5} 20,${y} 12,${y + 5} 12,${y + 2} 15.5,${y} 12,${y - 2}`;

// Command types first, output lines follow, then a fresh prompt; everything clears at the end
const STEPS = [
  { name: "command", from: 6, to: 18 },
  ...OUTPUT.map((_, index) => ({ name: `out${index}`, from: 26 + index * 7, to: 29 + index * 7 })),
  { name: "prompt", from: 50, to: 51 },
];

const STYLES = `
${STEPS.map(
  ({ name, from, to }) => `@keyframes isometric21-${name} { 0%, ${from}% { transform: scaleX(0); } ${to}%, 100% { transform: scaleX(1); } 0%, 86% { opacity: 1; } 92%, 100% { opacity: 0; } }
.isometric21-${name} { animation: isometric21-${name} ${PERIOD}s linear infinite; }`,
).join("\n")}
@keyframes isometric21-blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
.isometric21-grow { transform-box: fill-box; transform-origin: left center; }
.isometric21-blink { animation: isometric21-blink 1s linear infinite; }
.isometric21-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { ${STEPS.map(({ name }) => `.isometric21-${name}`).join(", ")}, .isometric21-blink { animation: none; } }
`;

export function Isometric21({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric21Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const ink = paint.body.ink;
  const lit = accent ? paint.accent.base : ink;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric21-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-56 -118 222 230" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(-8, -16, 0, W + 16, 56, BASE)} paint={paint.body} />
        <Block faces={box(0, 0, BASE, W, T, H)} paint={paint.body} />
        <g transform={onLeft(T)}>
          <g className={ink}>
            <circle cx={12} cy={TOP + 10} r={3} />
            <circle cx={22} cy={TOP + 10} r={3} />
            <circle cx={32} cy={TOP + 10} r={3} />
            <rect x={0} y={TOP + 19} width={W} height={1.5} />
          </g>
          <polygon points={chevron(row(0))} className={lit} />
          <rect x={26} y={row(0) - 3} width={64} height={6} rx={3} className={cn("isometric21-grow isometric21-command", ink)} />
          {OUTPUT.map((width, index) => (
            <rect key={index} x={12} y={row(index + 1) - 2} width={width} height={4} rx={2} className={cn("isometric21-grow", `isometric21-out${index}`, ink)} />
          ))}
          <g className="isometric21-grow isometric21-prompt">
            <polygon points={chevron(row(4))} className={lit} />
            <rect x={26} y={row(4) - 5} width={7} height={10} rx={1} className={cn("isometric21-blink", lit)} />
          </g>
        </g>
      </svg>
    </div>
  );
}
