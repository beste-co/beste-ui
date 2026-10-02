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

interface Isometric84Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the course being laid with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric84Demo: Isometric84Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const SLAB = box(-6, -6, 0, 110, 88, 6);
const BRICK = 16;
const COURSE = 8;
const COURSES = 5;
const Z0 = 6;
const LONG = 96;
const SHORT = 72;

interface Brick {
  key: string;
  faces: Faces;
  depth: number;
}

// Running bond with the corner brick alternating between the two walls
function course(c: number): Brick[] {
  const z = Z0 + c * COURSE;
  const bricks: Brick[] = [];
  const along = (start: number, end: number, place: (at: number, length: number) => void) => {
    for (let at = start; at < end; at += BRICK) place(at, Math.min(BRICK, end - at) - 1);
  };
  if (c % 2 === 0) {
    along(0, LONG, (x, length) => bricks.push({ key: `a${x}`, faces: box(x, 0, z, length, 8, COURSE - 1), depth: x }));
    along(8, SHORT, (y, length) => bricks.push({ key: `b${y}`, faces: box(0, y, z, 8, length, COURSE - 1), depth: y }));
  } else {
    along(0, SHORT, (y, length) => bricks.push({ key: `b${y}`, faces: box(0, y, z, 8, length, COURSE - 1), depth: y }));
    along(8, LONG, (x, length) => bricks.push({ key: `a${x}`, faces: box(x, 0, z, length, 8, COURSE - 1), depth: x }));
  }
  return bricks.sort((a, b) => a.depth - b.depth);
}

const LOWER = Array.from({ length: COURSES - 1 }, (_, c) => course(c));
const TOP = course(COURSES - 1);
const STEP = 60 / TOP.length;
const PALLET = box(52, 36, 6, 34, 26, 4);
const STACK = [0, 1].flatMap((layer) =>
  [0, 1, 2]
    .filter((row) => layer === 0 || row > 0)
    .flatMap((row) => [0, 1].map((col) => ({ key: `${layer}${row}${col}`, faces: box(53 + col * 16, 37 + row * 8, 10 + layer * COURSE, 15, 7, COURSE - 1) }))),
);

const STYLES = `
${TOP.map((_, index) => {
  const start = (4 + index * STEP).toFixed(1);
  const land = (4 + index * STEP + 7).toFixed(1);
  return `@keyframes isometric84-lay${index} { 0%, ${start}% { transform: translateY(-18px); opacity: 0; } ${land}%, 86% { transform: translateY(0); opacity: 1; } 95%, 100% { transform: translateY(0); opacity: 0; } }
.isometric84-brick${index} { animation: isometric84-lay${index} 6s cubic-bezier(0.3, 0, 0.2, 1) infinite; will-change: transform, opacity; }`;
}).join("\n")}
.isometric84-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric84-brick { animation: none !important; } }
`;

export function Isometric84({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric84Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric84-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-80 -68 180 162" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={SLAB} paint={paint.body} />
        {LOWER.map((bricks, c) => (
          <g key={c}>
            {bricks.map((brick) => (
              <Block key={brick.key} faces={brick.faces} paint={paint.body} />
            ))}
          </g>
        ))}
        {TOP.map((brick, index) => (
          <g key={brick.key} className={cn("isometric84-brick", `isometric84-brick${index}`)}>
            <Block faces={brick.faces} paint={paint.accent} />
          </g>
        ))}
        <Block faces={PALLET} paint={paint.body} />
        <g transform={onLeft(62)} className={paint.body.ink}>
          <rect x={56} y={-9} width={8} height={2} rx={1} />
          <rect x={74} y={-9} width={8} height={2} rx={1} />
        </g>
        {STACK.map((brick) => (
          <Block key={brick.key} faces={brick.faces} paint={paint.body} />
        ))}
      </svg>
    </div>
  );
}
