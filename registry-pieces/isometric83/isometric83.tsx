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

interface Isometric83Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the hard hat with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric83Demo: Isometric83Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

// A circle of radius r in plan projects to an ellipse with these radii
const ELLIPSE_X = C * Math.SQRT2;
const ELLIPSE_Y = S * Math.SQRT2;

/** A half sphere sitting on a circle of radius r at height z. */
function Dome({ r, z, paint }: { r: number; z: number; paint: Paint }) {
  const rx = r * ELLIPSE_X;
  const ry = r * ELLIPSE_Y;
  const base = -z;
  const left = `M${-rx} ${base} A${rx} ${rx} 0 0 1 0 ${base - rx} L0 ${base + ry} A${rx} ${ry} 0 0 1 ${-rx} ${base} Z`;
  const right = `M${rx} ${base} A${rx} ${rx} 0 0 0 0 ${base - rx} L0 ${base + ry} A${rx} ${ry} 0 0 0 ${rx} ${base} Z`;
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <path d={left} className={paint.base} />
      <path d={left} className={paint.left} stroke="none" />
      <path d={right} className={paint.base} />
      <path d={right} className={paint.right} stroke="none" />
    </g>
  );
}

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

const SHEET_W = 96;
const SHEET_D = 64;
const ROLL_R = 6;
const HAT = { x: 32, y: 32 };
const HAT_AT = `translate(${((HAT.x - HAT.y) * C).toFixed(1)} ${((HAT.x + HAT.y) * S).toFixed(1)})`;
const BRIM_R = 25;
const DOME_R = 21;
const ROLL = rod("y", 0, SHEET_D, SHEET_W, ROLL_R, ROLL_R);
// Rolled up, the sheet is this share of its full length
const ROLLED = 0.78;
const ROLL_BACK = `translate(${(-SHEET_W * (1 - ROLLED) * C).toFixed(1)}px, ${(-SHEET_W * (1 - ROLLED) * S).toFixed(1)}px)`;

const STYLES = `
@keyframes isometric83-sheet { 0%, 6% { transform: scaleX(${ROLLED}); } 36%, 78% { transform: scaleX(1); } 96%, 100% { transform: scaleX(${ROLLED}); } }
@keyframes isometric83-roll { 0%, 6% { transform: ${ROLL_BACK}; } 36%, 78% { transform: translate(0, 0); } 96%, 100% { transform: ${ROLL_BACK}; } }
@keyframes isometric83-plan { 0%, 36% { opacity: 0; } 46%, 74% { opacity: 1; } 80%, 100% { opacity: 0; } }
.isometric83-sheet { animation: isometric83-sheet 5.6s cubic-bezier(0.45, 0, 0.25, 1) infinite; transform-box: fill-box; transform-origin: left center; }
.isometric83-roll { animation: isometric83-roll 5.6s cubic-bezier(0.45, 0, 0.25, 1) infinite; will-change: transform; }
.isometric83-plan { animation: isometric83-plan 5.6s ease-in-out infinite; }
.isometric83-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric83-sheet, .isometric83-roll, .isometric83-plan { animation: none; } }
`;

export function Isometric83({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric83Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const ink = paint.body.ink;
  const ridge = paint.accent.ink.replace("fill-", "stroke-");

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric83-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-64 -4 160 100" aria-hidden="true" className="size-full overflow-visible">
        <g transform={onTop(0)}>
          <rect x={0} y={0} width={SHEET_W} height={SHEET_D} vectorEffect="non-scaling-stroke" strokeWidth={1} className={cn("isometric83-sheet", paint.body.base, paint.body.edge)} />
        </g>
        <g transform={onTop(0)} className={cn("isometric83-plan", ink)}>
          <path
            fillRule="evenodd"
            d="M62 8H92V56H62Z M64 10H76V30H64Z M78 10H90V30H78Z M64 32H90V54H64Z"
          />
          <rect x={68} y={38} width={10} height={2} rx={1} />
          <rect x={68} y={43} width={14} height={2} rx={1} />
          <rect x={80} y={16} width={8} height={2} rx={1} />
        </g>
        <RoundBlock shape={roundBox(HAT.x - BRIM_R, HAT.y - BRIM_R, 0, BRIM_R * 2 + 10, BRIM_R * 2, 3, BRIM_R)} paint={paint.accent} />
        <g transform={HAT_AT}>
          <Dome r={DOME_R} z={3} paint={paint.accent} />
          <g transform={`translate(${(-HAT.x + HAT.y) * C} ${-(HAT.x + HAT.y) * S})`}>
            <g transform={onLeft(HAT.y)}>
              <path d={`M${HAT.x - DOME_R + 1} -4 A${DOME_R - 1} ${DOME_R - 1} 0 0 1 ${HAT.x + DOME_R - 1} -4`} fill="none" strokeWidth={5} strokeLinecap="round" className={ridge} />
            </g>
          </g>
        </g>
        <g className="isometric83-roll">
          <RodBlock shape={ROLL} paint={paint.body} />
          <g transform={onLeft(SHEET_D)} className={ink}>
            <path fillRule="evenodd" d={`M${SHEET_W - 4} ${-ROLL_R} A4 4 0 1 0 ${SHEET_W + 4} ${-ROLL_R} A4 4 0 1 0 ${SHEET_W - 4} ${-ROLL_R} Z M${SHEET_W - 2} ${-ROLL_R} A2 2 0 1 1 ${SHEET_W + 2} ${-ROLL_R} A2 2 0 1 1 ${SHEET_W - 2} ${-ROLL_R} Z`} />
          </g>
        </g>
      </svg>
    </div>
  );
}
