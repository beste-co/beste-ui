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

interface Isometric135Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the glass with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric135Demo: Isometric135Props = {
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

type Plan = [number, number][];

/** A flat solid standing on a plan outline, showing only the sides that face the viewer. */
function prism(outline: Plan, z: number, h: number) {
  const area = outline.reduce((sum, [ax, ay], index) => {
    const [bx, by] = outline[(index + 1) % outline.length] as [number, number];
    return sum + ax * by - bx * ay;
  }, 0);
  const points = area < 0 ? [...outline].reverse() : outline;
  const sides = points.flatMap(([ax, ay], index) => {
    const [bx, by] = points[(index + 1) % points.length] as [number, number];
    const [nx, ny] = [by - ay, ax - bx];
    if (nx + ny <= 0) return [];
    return [{ points: polygon([[ax, ay, z + h], [bx, by, z + h], [bx, by, z], [ax, ay, z]]), left: ny > nx }];
  });
  return { top: polygon(points.map(([px, py]): Point => [px, py, z + h])), sides };
}

function Prism({ shape, paint }: { shape: ReturnType<typeof prism>; paint: Paint }) {
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      {shape.sides.map((side) => (
        <g key={side.points}>
          <polygon points={side.points} className={paint.base} />
          <polygon points={side.points} className={side.left ? paint.left : paint.right} stroke="none" />
        </g>
      ))}
      <polygon points={shape.top} className={paint.base} />
    </g>
  );
}

const cylinder = (cx: number, cy: number, z: number, h: number, r: number) => roundBox(cx - r, cy - r, z, 2 * r, 2 * r, h, r);

const PLINTH = 6;
const MID = 32;
const GLASS_TOP = PLINTH + 36;
const BOTTLE: Plan = [[15, 20], [49, 20], [54, 25], [54, 39], [49, 44], [15, 44], [10, 39], [10, 25]];
const CAP = GLASS_TOP + 4;
const PUSH = CAP + 12;
const [NX, NY] = project([MID, MID + 8, CAP + 6]).split(",").map(Number) as [number, number];
const MIST = [
  { x: -9, y: -1, r: 2.5 },
  { x: -17, y: -3, r: 3.5 },
  { x: -27, y: -5, r: 5 },
  { x: -38, y: -6, r: 6.5 },
];

const STYLES = `
@keyframes isometric135-press { 0%, 12% { transform: translateY(0); } 18%, 30% { transform: translateY(2px); } 38%, 100% { transform: translateY(0); } }
@keyframes isometric135-mist { 0%, 16% { transform: translate(10px, 3px) scale(0.3); opacity: 0; } 30% { opacity: 1; } 60% { transform: translate(-3px, -2px) scale(1); opacity: 0.9; } 85%, 100% { transform: translate(-6px, -5px) scale(1.15); opacity: 0; } }
.isometric135-press { animation: isometric135-press 5s ease-in-out infinite; }
.isometric135-mist { animation: isometric135-mist 5s ease-out infinite; transform-box: fill-box; transform-origin: center; }
.isometric135-mist:nth-child(2) { animation-delay: 0.12s; }
.isometric135-mist:nth-child(3) { animation-delay: 0.24s; }
.isometric135-mist:nth-child(4) { animation-delay: 0.36s; }
.isometric135-still * { animation: none !important; }
.isometric135-still .isometric135-rest { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .isometric135-press, .isometric135-mist { animation: none; } .isometric135-rest { opacity: 1; } }
`;

export function Isometric135({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric135Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const glass = paint.accent;
  const mist = palette === "tone" ? "fill-current opacity-40" : accent ? cn(glass.base, "opacity-40") : body.ink;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric135-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-55 -39 107 100" aria-hidden="true" className="size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, 64, 64, PLINTH, 14)} paint={body} />
        <rect x={8} y={8} width={48} height={48} rx={10} transform={onTop(PLINTH)} fill="none" strokeWidth={1.5} vectorEffect="non-scaling-stroke" className={body.ink.replace("fill-", "stroke-")} />
        <Prism shape={prism(BOTTLE, PLINTH, GLASS_TOP - PLINTH)} paint={glass} />
        <g transform={onLeft(44)}>
          <rect x={22} y={-GLASS_TOP + 8} width={20} height={14} rx={2} className={glass.ink} />
          <rect x={17} y={-GLASS_TOP + 4} width={2} height={GLASS_TOP - PLINTH - 8} rx={1} className="fill-white/40" />
        </g>
        <polygon points={prism([[16, 25], [48, 25], [48, 39], [16, 39]], GLASS_TOP, 0).top} className={glass.ink} />
        <RoundBlock shape={cylinder(MID, MID, GLASS_TOP, 4, 5)} paint={body} />
        <RoundBlock shape={cylinder(MID, MID, CAP, 12, 8)} paint={body} />
        <circle cx={NX} cy={NY} r={1.5} className={body.ink} />
        <g className="isometric135-press">
          <RoundBlock shape={cylinder(MID, MID, PUSH, 4, 6)} paint={body} />
        </g>
        <g transform={`translate(${NX} ${NY})`}>
          {MIST.map((puff) => (
            <g key={puff.x} className="isometric135-mist isometric135-rest opacity-0">
              <circle cx={puff.x} cy={puff.y} r={puff.r} className={mist} />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
