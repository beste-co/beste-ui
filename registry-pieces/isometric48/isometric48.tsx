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

interface Isometric48Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the counting bead on each rod with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric48Demo: Isometric48Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

type Rod = ReturnType<typeof rod>;

/** A round rod lying along x or y from a to b, centered on (u, z) in the other two axes. */
function rod(axis: "x" | "y", a: number, b: number, u: number, z: number, r: number) {
  const at = (t: number, degrees: number): Point => {
    const angle = (degrees * Math.PI) / 180;
    const du = r * Math.cos(angle);
    const dz = r * Math.sin(angle);
    return axis === "x" ? [t, u + du, z + dz] : [u + du, t, z + dz];
  };
  const arc = (t: number, from: number, to: number) => Array.from({ length: 13 }, (_, k) => at(t, from + ((to - from) * k) / 12));
  const band = (from: number, to: number) => polygon([...arc(a, from, to), ...arc(b, from, to).reverse()]);
  return { axis, side: band(-45, 135), shade: band(-45, 45), cap: polygon(Array.from({ length: 36 }, (_, k) => at(b, k * 10))) };
}

function RodBlock({ shape, paint }: { shape: Rod; paint: Paint }) {
  const along = shape.axis === "y";
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <polygon points={shape.side} className={paint.base} />
      <polygon points={shape.shade} className={along ? paint.right : paint.left} stroke="none" />
      <polygon points={shape.cap} className={paint.base} />
      <polygon points={shape.cap} className={along ? paint.left : paint.right} stroke="none" />
    </g>
  );
}

const G = 6;
const W = 100;
const DEPTH = 12;
const POST = 6;
const RAIL = 6;
const MID = DEPTH / 2;
// Rods run along x between the two uprights; beads are short cylinders on them
const INNER = { from: POST, to: W - POST };
const BEAD = { w: 8, r: 6, edge: 1.5 };
const COUNT = 5;
const ROD_Z = [0, 1, 2, 3, 4].map((index) => G + RAIL + 11 + index * 16);
const TOP = (ROD_Z[ROD_Z.length - 1] ?? 0) + 13;
// How many beads rest against the far upright on each rod; the last of them is the one that counts across
const LEFT = [3, 2, 4, 1, 3];
// The free stretch of rod: a bead slides exactly this far before it touches the next one
const TRAVEL = INNER.to - INNER.from - COUNT * BEAD.w;
const slide = (units: number) => `translate(${(units * C).toFixed(2)}px, ${(units * S).toFixed(2)}px)`;

const STYLES = `
@keyframes isometric48-count { 0%, 6% { transform: ${slide(0)}; } 18% { transform: ${slide(TRAVEL)}; } 21% { transform: ${slide(TRAVEL - 1.5)}; } 24%, 58% { transform: ${slide(TRAVEL)}; } 70% { transform: ${slide(0)}; } 73% { transform: ${slide(1.5)}; } 76%, 100% { transform: ${slide(0)}; } }
.isometric48-bead { animation: isometric48-count 8s cubic-bezier(0.5, 0, 0.5, 1) infinite; will-change: transform; }
.isometric48-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric48-bead { animation: none; } }
`;

/** One bead whose far face sits at x: a chunky cylinder with a narrower rim, a hole, and the rod leaving it. */
function Bead({ x, z, paint, wire, hole }: { x: number; z: number; paint: Paint; wire: Paint; hole: string }) {
  const front = x + BEAD.w;
  return (
    <>
      <RodBlock shape={rod("x", x, x + BEAD.edge, MID, z, BEAD.r - BEAD.edge)} paint={paint} />
      <RodBlock shape={rod("x", x + BEAD.edge, front - BEAD.edge, MID, z, BEAD.r)} paint={paint} />
      <RodBlock shape={rod("x", front - BEAD.edge, front, MID, z, BEAD.r - BEAD.edge)} paint={paint} />
      <g transform={onRight(front)}>
        <circle cx={MID} cy={-z} r={2} className={hole} />
      </g>
      <RodBlock shape={rod("x", front, front + 4, MID, z, 1)} paint={wire} />
    </>
  );
}

export function Isometric48({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric48Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const hole = palette === "dark" ? "fill-black/50" : "fill-black/25";

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric48-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-28 -114 132 184" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(-6, -6, 0, W + 12, DEPTH + 12, G)} paint={body} />
        <Block faces={box(0, 0, G, POST, DEPTH, TOP - G)} paint={body} />
        <Block faces={box(POST, 0, G, W - 2 * POST, DEPTH, RAIL)} paint={body} />
        {ROD_Z.map((z, row) => {
          const left = LEFT[row] ?? 0;
          const mover = left - 1;
          const beads = Array.from({ length: COUNT }, (_, index) => (index < left ? INNER.from + index * BEAD.w : INNER.to - (COUNT - index) * BEAD.w));
          return (
            <g key={z}>
              <RodBlock shape={rod("x", INNER.from, INNER.to, MID, z, 1)} paint={body} />
              {beads.map((x, index) =>
                index === mover ? (
                  <g key={x} className="isometric48-bead" style={{ animationDelay: `${row * 0.45}s` }}>
                    <Bead x={x} z={z} paint={paint.accent} wire={body} hole={hole} />
                  </g>
                ) : (
                  <Bead key={x} x={x} z={z} paint={body} wire={body} hole={hole} />
                ),
              )}
            </g>
          );
        })}
        <Block faces={box(W - POST, 0, G, POST, DEPTH, TOP - G)} paint={body} />
        <Block faces={box(-2, -2, TOP, W + 4, DEPTH + 4, RAIL)} paint={body} />
        <g transform={onLeft(DEPTH + 2)} className={body.ink}>
          <rect x={W / 2 - 12} y={-TOP - 4} width={24} height={2} rx={1} />
        </g>
      </svg>
    </div>
  );
}
