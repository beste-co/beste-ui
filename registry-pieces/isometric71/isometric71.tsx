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

interface Isometric71Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the flash and its burst with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric71Demo: Isometric71Props = {
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

const disc = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0Z`;

/** Outline of a disc in the plane y, centered on (cx, z), swept toward the viewer from y0 to y1. */
function barrel(cx: number, cz: number, r: number, y0: number, y1: number) {
  const points: [number, number][] = [];
  for (let k = 0; k < 48; k++) {
    const a = (k / 48) * Math.PI * 2;
    for (const y of [y0, y1]) {
      const x = cx + r * Math.cos(a);
      const z = cz + r * Math.sin(a);
      points.push([(x - y) * C, (x + y) * S - z]);
    }
  }
  points.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  const cross = (o: [number, number], a: [number, number], b: [number, number]) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = (list: [number, number][]) => {
    const out: [number, number][] = [];
    for (const point of list) {
      let a = out[out.length - 2];
      let b = out[out.length - 1];
      while (a && b && cross(a, b, point) <= 0) {
        out.pop();
        a = out[out.length - 2];
        b = out[out.length - 1];
      }
      out.push(point);
    }
    return out.slice(0, -1);
  };
  return [...half(points), ...half([...points].reverse())].map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

/** A round barrel pointing at the viewer: the swept side, then the front disc. */
function Barrel({ cx, cz, r, y0, y1, paint }: { cx: number; cz: number; r: number; y0: number; y1: number; paint: Paint }) {
  const side = barrel(cx, cz, r, y0, y1);
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <polygon points={side} className={paint.base} />
      <polygon points={side} className={paint.right} stroke="none" />
      <g transform={onLeft(y1)}>
        <path d={disc(cx, -cz, r)} vectorEffect="non-scaling-stroke" className={paint.base} />
        <path d={disc(cx, -cz, r)} stroke="none" className={paint.left} />
      </g>
    </g>
  );
}

const W = 104;
const D = 40;
const H = 60;
const LENS_X = 56;
const LENS_Z = 28;
const FLASH = { x: 80, z: 44, w: 16, h: 10 };
const RAYS = Array.from({ length: 8 }, (_, index) => index * 45);

const STYLES = `
@keyframes isometric71-press { 0%, 18%, 34%, 100% { transform: translateY(0); } 22%, 28% { transform: translateY(3px); } }
@keyframes isometric71-flash { 0%, 24% { opacity: 0; } 26% { opacity: 1; } 44%, 100% { opacity: 0; } }
@keyframes isometric71-burst { 0%, 24% { transform: scale(0.4); opacity: 0; } 27% { transform: scale(0.9); opacity: 1; } 48%, 100% { transform: scale(1.3); opacity: 0; } }
.isometric71-button { animation: isometric71-press 4s ease-in-out infinite; }
.isometric71-glow { animation: isometric71-flash 4s ease-out infinite; }
.isometric71-burst { animation: isometric71-burst 4s ease-out infinite; transform-box: fill-box; transform-origin: center; }
.isometric71-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric71-button, .isometric71-glow, .isometric71-burst { animation: none; } }
`;

export function Isometric71({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric71Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const flash = accent ? paint.accent.base : paint.body.ink;
  const glass = palette === "tone" ? "fill-black/30" : paint.body.ink;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric71-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-58 -94 170 176" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(0, 0, 0, W, D, H)} paint={paint.body} />
        <Block faces={box(40, 8, H, 32, 24, 8)} paint={paint.body} />
        <Block faces={box(46, 12, H + 8, 20, 16, 4)} paint={paint.body} />
        <g className="isometric71-button">
          <RoundBlock shape={roundBox(8, 14, H, 12, 12, 5, 6)} paint={paint.body} />
        </g>
        <RoundBlock shape={roundBox(80, 10, H, 18, 18, 5, 9)} paint={paint.body} />
        <g transform={onTop(H + 5)} className={paint.body.ink}>
          <path d={disc(89, 19, 5)} />
        </g>
        <g transform={onLeft(D)} className={paint.body.ink}>
          <rect x={30} y={-54} width={10} height={4} rx={2} />
        </g>
        <Block faces={box(0, D, 0, 22, 6, 54)} paint={paint.body} />
        <Barrel cx={LENS_X} cz={LENS_Z} r={22} y0={D} y1={D + 10} paint={paint.body} />
        <Barrel cx={LENS_X} cz={LENS_Z} r={17} y0={D + 10} y1={D + 18} paint={paint.body} />
        <g transform={onLeft(D + 18)}>
          <path d={disc(LENS_X, -LENS_Z, 12)} className={glass} />
          <path d={disc(LENS_X, -LENS_Z, 7)} className={glass} />
          <path d={disc(LENS_X - 4, -LENS_Z - 4, 2.5)} className={paint.body.base} />
        </g>
        <g transform={onLeft(D)}>
          <rect x={FLASH.x} y={-FLASH.z - FLASH.h} width={FLASH.w} height={FLASH.h} rx={2} className={flash} />
          <rect x={FLASH.x} y={-FLASH.z - FLASH.h} width={FLASH.w} height={FLASH.h} rx={2} className={cn("isometric71-glow opacity-0", paint.body.base)} />
          <g className="isometric71-burst opacity-0">
            {RAYS.map((angle) => (
              <rect
                key={angle}
                x={FLASH.x + FLASH.w / 2 + 14}
                y={-FLASH.z - FLASH.h / 2 - 2}
                width={10}
                height={4}
                rx={2}
                transform={`rotate(${angle} ${FLASH.x + FLASH.w / 2} ${-FLASH.z - FLASH.h / 2})`}
                className={accent ? paint.accent.base : paint.body.ink}
              />
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
