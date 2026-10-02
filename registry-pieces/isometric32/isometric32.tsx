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

interface Isometric32Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the item dropping in with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric32Demo: Isometric32Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

// A circle of radius r in plan projects to an ellipse with these radii
const ELLIPSE_X = C * Math.SQRT2;
const ELLIPSE_Y = S * Math.SQRT2;
const at = (x: number, y: number, z = 0) => `translate(${project([x, y, z]).replace(",", " ")})`;

/** An upright cylinder around (x, y) in plan; r2 sets a different top radius for a taper. */
function Cylinder({ x = 0, y = 0, z, h, r, r2 = r, paint, lid = true }: { x?: number; y?: number; z: number; h: number; r: number; r2?: number; paint: Paint; lid?: boolean }) {
  const [bx, by, tx, ty] = [r * ELLIPSE_X, r * ELLIPSE_Y, r2 * ELLIPSE_X, r2 * ELLIPSE_Y].map((n) => +n.toFixed(2));
  const top = -z - h;
  const bottom = -z;
  const left = `M${-tx} ${top} L${-bx} ${bottom} A${bx} ${by} 0 0 0 0 ${bottom + by} L0 ${top + ty} A${tx} ${ty} 0 0 1 ${-tx} ${top} Z`;
  const right = `M${tx} ${top} L${bx} ${bottom} A${bx} ${by} 0 0 1 0 ${bottom + by} L0 ${top + ty} A${tx} ${ty} 0 0 0 ${tx} ${top} Z`;
  return (
    <g transform={at(x, y)} className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <path d={left} className={paint.base} />
      <path d={left} className={paint.left} stroke="none" />
      <path d={right} className={paint.base} />
      <path d={right} className={paint.right} stroke="none" />
      {lid && <ellipse cx={0} cy={top} rx={tx} ry={ty} className={paint.base} />}
    </g>
  );
}

const W = 60;
const D = 36;
const H = 64;
const WALL = 2;
// A rope handle standing on a wide face, in that face's (x, -z) units
const HANDLE = `M18 ${-H} V${-H - 8} A12 12 0 0 1 42 ${-H - 8} V${-H} H38 V${-H - 8} A8 8 0 0 0 22 ${-H - 8} V${-H} Z`;
// The bag is already packed: everything stands on the bag floor, and the new box lands on the carton under it
const SHELF = 42;
const CARTON = box(4, 4, 0, 28, 26, SHELF);
const ITEM = box(7, 7, SHELF, 22, 18, 28);
const PACK = box(34, 22, 0, 20, 10, 54);

const STYLES = `
@keyframes isometric32-drop { 0% { transform: translateY(-56px); opacity: 0; } 10% { opacity: 1; } 30% { transform: translateY(0); } 35% { transform: translateY(-4px); } 40%, 100% { transform: translateY(0); } 0%, 82% { opacity: 1; } 94%, 100% { opacity: 0; } }
@keyframes isometric32-settle { 0%, 29% { transform: scaleY(1); } 33% { transform: scaleY(0.97); } 40%, 100% { transform: scaleY(1); } }
.isometric32-item { animation: isometric32-drop 4.8s cubic-bezier(0.5, 0, 0.3, 1) infinite; will-change: transform, opacity; }
.isometric32-bag { animation: isometric32-settle 4.8s ease-out infinite; transform-box: fill-box; transform-origin: bottom; }
.isometric32-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric32-item, .isometric32-bag { animation: none; } }
`;

export function Isometric32({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric32Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const outer = box(0, 0, 0, W, D, H);
  const innerBack = polygon([[WALL, WALL, H], [W - WALL, WALL, H], [W - WALL, WALL, 0], [WALL, WALL, 0]]);
  const innerSide = polygon([[WALL, WALL, H], [WALL, D - WALL, H], [WALL, D - WALL, 0], [WALL, WALL, 0]]);

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric32-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-38 -94 96 146" aria-hidden="true" className="size-full overflow-visible">
        <g className="isometric32-bag">
          <g className={body.edge} strokeWidth={1} strokeLinejoin="round">
            <g transform={onLeft(WALL)}>
              <path d={HANDLE} className={body.base} />
              <path d={HANDLE} className={body.right} stroke="none" />
            </g>
            <polygon points={innerSide} className={body.base} />
            <polygon points={innerSide} className={body.right} stroke="none" />
            <polygon points={innerBack} className={body.base} />
            <polygon points={innerBack} className={body.left} stroke="none" />
          </g>
          <Cylinder x={38} y={7} z={0} h={86} r={3} paint={body} />
          <Block faces={CARTON} paint={body} />
          <g transform={onTop(SHELF)} className={body.ink}>
            <rect x={4} y={4} width={28} height={26} />
            <rect x={4} y={15.5} width={28} height={3} />
          </g>
          <g className="isometric32-item">
            <Block faces={ITEM} paint={paint.accent} />
            <g transform={onLeft(25)} className={paint.accent.ink}>
              <rect x={11} y={-(SHELF + 22)} width={14} height={4} rx={2} />
            </g>
          </g>
          <Cylinder x={47} y={12} z={0} h={62} r={7} paint={body} />
          <Cylinder x={47} y={12} z={62} h={12} r={3} paint={body} />
          <Block faces={PACK} paint={body} />
          <g transform={onTop(54)} className={body.ink}>
            <rect x={34} y={22} width={20} height={10} />
          </g>
          <g className={body.edge} strokeWidth={1} strokeLinejoin="round">
            <polygon points={outer.left} className={body.base} />
            <polygon points={outer.left} className={body.left} stroke="none" />
            <polygon points={outer.right} className={body.base} />
            <polygon points={outer.right} className={body.right} stroke="none" />
            <g transform={onTop(H)} className={body.base}>
              <rect x={0} y={D - WALL} width={W} height={WALL} />
              <rect x={W - WALL} y={0} width={WALL} height={D} />
            </g>
          </g>
          <g transform={onLeft(D)} className={body.ink}>
            <rect x={0} y={-H} width={W} height={6} />
            <circle cx={W / 2} cy={-28} r={6} />
          </g>
          <g transform={onRight(W)} className={body.ink}>
            <rect x={0} y={-H} width={D} height={6} />
            <polygon points={`${D / 2 - 0.6},${-H} ${D / 2 + 0.6},${-H} ${D / 2 + 0.6},0 ${D / 2 - 0.6},0`} />
            <polygon points={`0,${-H} ${D / 2},${-H + 14} ${D},${-H} ${D},${-H + 1.5} ${D / 2},${-H + 15.5} 0,${-H + 1.5}`} />
          </g>
          <g transform={onLeft(D)} className={body.edge} strokeWidth={1} strokeLinejoin="round">
            <path d={HANDLE} className={body.base} />
            <path d={HANDLE} className={body.left} stroke="none" />
          </g>
        </g>
      </svg>
    </div>
  );
}
