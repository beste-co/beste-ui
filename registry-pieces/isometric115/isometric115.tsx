"use client";

import { useId } from "react";
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

interface Isometric115Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the roof light with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric115Demo: Isometric115Props = {
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

const G = 8;
const BAY = box(0, 0, 0, 124, 68, G);
const Y0 = 18;
const Y1 = 48;
const Z = G + 8;
const R = 9;
const WHEELS = [34, 92];
const BACK = 14;
const CAB = 76;
const NOSE = 106;
const ROOF = Z + 42;
const HOOD = Z + 20;
const face = (points: Point[]) => polygon(points);
const SLOPE = face([[CAB + 6, Y0, ROOF - 8], [CAB + 18, Y0, HOOD + 2], [CAB + 18, Y1, HOOD + 2], [CAB + 6, Y1, ROOF - 8]]);
const CAB_TOP = face([[CAB, Y0, ROOF - 8], [CAB + 6, Y0, ROOF - 8], [CAB + 6, Y1, ROOF - 8], [CAB, Y1, ROOF - 8]]);
const CAB_SIDE = face([[CAB, Y1, HOOD], [CAB + 18, Y1, HOOD], [CAB + 18, Y1, HOOD + 2], [CAB + 6, Y1, ROOF - 8], [CAB, Y1, ROOF - 8]]);
const WINDOW = face([[CAB + 2, Y1, HOOD + 3], [CAB + 15, Y1, HOOD + 3], [CAB + 7, Y1, ROOF - 11], [CAB + 2, Y1, ROOF - 11]]);
const LAMPS = [Y0 + 4, Y0 + 15];

// The van stays in frame; the lane markings slide back under it
const PITCH = 24;
const STYLES = `
@keyframes isometric115-road { to { transform: translateX(${-PITCH}px); } }
@keyframes isometric115-van { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1px); } }
.isometric115-road { animation: isometric115-road 0.9s linear infinite; }
.isometric115-van { animation: isometric115-van 1.1s ease-in-out infinite; }
@keyframes isometric115-flash { 0%, 100% { opacity: 1; } 12% { opacity: 0.15; } 25% { opacity: 1; } 37% { opacity: 0.15; } 50%, 90% { opacity: 1; } }
@keyframes isometric115-flash-b { 0%, 100% { opacity: 0.15; } 12% { opacity: 1; } 25% { opacity: 0.15; } 37% { opacity: 1; } 50% { opacity: 0.15; } 90% { opacity: 0.15; } }
.isometric115-flash { animation: isometric115-flash 3.2s steps(1, end) infinite; }
.isometric115-flash-b { animation: isometric115-flash-b 3.2s steps(1, end) infinite; }
.isometric115-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric115-van, .isometric115-road, .isometric115-flash, .isometric115-flash-b { animation: none; } }
`;

function Wheels({ y, paint }: { y: number; paint: Paint }) {
  return (
    <g>
      {WHEELS.map((x) => (
        <g key={x}>
          <RodBlock shape={rod("y", y, y + 5, x, Z + 1, R)} paint={paint} />
          <g transform={onLeft(y + 5)} className={paint.ink}>
            <circle cx={x} cy={-(Z + 1)} r={4} />
          </g>
        </g>
      ))}
    </g>
  );
}

export function Isometric115({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric115Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric115-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-66 -52 180 154" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={BAY} paint={body} />
        <defs>
          <clipPath id={clipId}>
            <polygon points={BAY.top} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <g transform={onTop(G)} className={body.ink}>
            <g className="isometric115-road">
              {[0, 1, 2, 3, 4, 5, 6].flatMap((index) =>
                [4, 61].map((y) => <rect key={`${index}-${y}`} x={index * PITCH - 6} y={y} width={14} height={3} rx={1.5} />),
              )}
            </g>
          </g>
        </g>
        <g className="isometric115-van">
        <Wheels y={Y0 - 2} paint={body} />
        <Block faces={box(BACK, Y0, Z - 4, CAB - BACK, Y1 - Y0, 4)} paint={body} />
        <Block faces={box(BACK, Y0, Z, CAB - BACK, Y1 - Y0, ROOF - Z)} paint={body} />
        <Block faces={box(CAB, Y0, Z - 4, NOSE - CAB, Y1 - Y0, HOOD - Z + 4)} paint={body} />
        <g className={body.edge} strokeWidth={1} strokeLinejoin="round">
          <polygon points={CAB_SIDE} className={body.base} />
          <polygon points={CAB_SIDE} className={body.left} stroke="none" />
          <polygon points={CAB_TOP} className={body.base} />
          <polygon points={SLOPE} className={body.base} />
        </g>
        <polygon points={WINDOW} className={body.ink} />
        <g transform={onLeft(Y1)} className={body.ink}>
          <rect x={BACK} y={-(Z + 14)} width={NOSE - BACK} height={4} />
          <path d={`M${40} ${-(Z + 34)}h6v-6h6v6h6v6h-6v6h-6v-6h-6z`} />
          <rect x={BACK + 4} y={-(ROOF - 6)} width={12} height={10} rx={1.5} />
        </g>
        <g transform={onRight(NOSE)} className={body.ink}>
          <rect x={Y0 + 3} y={-(HOOD - 4)} width={5} height={4} rx={1} />
          <rect x={Y1 - 8} y={-(HOOD - 4)} width={5} height={4} rx={1} />
          <rect x={Y0 + 10} y={-(HOOD - 5)} width={Y1 - Y0 - 20} height={6} rx={1} />
        </g>
        <polygon points={SLOPE} className={body.ink} />
        {LAMPS.map((y, index) => (
          <g key={y}>
            <Block faces={box(CAB - 14, y, ROOF, 10, 11, 6)} paint={paint.accent} />
            <polygon points={box(CAB - 14, y, ROOF, 10, 11, 6).top} className={cn(paint.accent.ink, index === 0 ? "isometric115-flash" : "isometric115-flash-b")} />
          </g>
        ))}
        <Wheels y={Y1 - 3} paint={body} />
        </g>
      </svg>
    </div>
  );
}
