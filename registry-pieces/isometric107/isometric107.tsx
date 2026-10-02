"use client";

import { useId } from "react";
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

interface Isometric107Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Light the bulb in the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric107Demo: Isometric107Props = {
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

/** An upright cylinder standing on plan point (cx, cy). */
const cylinder = (cx: number, cy: number, z: number, h: number, r: number) => roundBox(cx - r, cy - r, z, 2 * r, 2 * r, h, r);

/** A ring band around the z axis, drawn on the visible half. */
function band(r: number, z: number, h: number) {
  const points = Array.from({ length: 17 }, (_, k) => {
    const angle = ((-45 + (180 * k) / 16) * Math.PI) / 180;
    return [r * Math.cos(angle), r * Math.sin(angle)] as const;
  });
  return polygon([...points.map(([x, y]): Point => [x, y, z]), ...[...points].reverse().map(([x, y]): Point => [x, y, z + h])]);
}

const PLINTH = 8;
const COLLAR = PLINTH + 6;
const SCREW = COLLAR + 16;
const RIDGES = [COLLAR + 3, COLLAR + 8, COLLAR + 13];
// The glass in screen units: a neck rising from the screw into a round globe
const GLOBE = { y: -SCREW - 38, r: 30 };
const NECK = 11;
const GLASS = `M${-NECK} ${-SCREW} C${-NECK} ${-SCREW - 10} ${-GLOBE.r} ${GLOBE.y + 22} ${-GLOBE.r} ${GLOBE.y} A${GLOBE.r} ${GLOBE.r} 0 0 1 ${GLOBE.r} ${GLOBE.y} C${GLOBE.r} ${GLOBE.y + 22} ${NECK} ${-SCREW - 10} ${NECK} ${-SCREW} A${NECK} ${NECK * 0.58} 0 0 1 ${-NECK} ${-SCREW} Z`;
const FILAMENT = `M-5 ${-SCREW - 2} L-7 ${GLOBE.y + 2} M5 ${-SCREW - 2} L7 ${GLOBE.y + 2} M-7 ${GLOBE.y + 2} c1.5 -5 3 -5 3.5 0 c0.5 5 2 5 3.5 0 c1.5 -5 3 -5 3.5 0 c0.5 5 2 5 3.5 0`;
const HALOS = [GLOBE.r + 10, GLOBE.r + 20];

const STYLES = `
@keyframes isometric107-lit { 0%, 18% { opacity: 0; } 21% { opacity: 1; } 23% { opacity: 0.35; } 27%, 80% { opacity: 1; } 90%, 100% { opacity: 0; } }
@keyframes isometric107-halo { 0%, 22% { transform: scale(0.8); opacity: 0; } 34% { transform: scale(1); opacity: 1; } 56% { transform: scale(1.04); opacity: 0.7; } 78% { transform: scale(1); opacity: 1; } 90%, 100% { transform: scale(0.9); opacity: 0; } }
.isometric107-lit { animation: isometric107-lit 5s ease-in-out infinite; }
.isometric107-halo { animation: isometric107-halo 5s ease-in-out infinite; transform-box: fill-box; transform-origin: center; will-change: transform, opacity; }
.isometric107-still * { animation: none !important; }
.isometric107-still .isometric107-rest { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .isometric107-lit, .isometric107-halo { animation: none; } .isometric107-rest { opacity: 1; } }
`;

export function Isometric107({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric107Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const lit = paint.accent;
  const wire = (fill: string) => fill.replace("fill-", "stroke-");

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric107-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-58 -126 116 152" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <path d={GLASS} />
          </clipPath>
        </defs>
        <g className="isometric107-halo isometric107-rest opacity-0">
          {HALOS.map((r, index) => (
            <circle key={r} cx={0} cy={GLOBE.y} r={r} className={cn(lit.base, index === 0 ? "opacity-20" : "opacity-10")} />
          ))}
        </g>
        <RoundBlock shape={cylinder(0, 0, 0, PLINTH, 26)} paint={body} />
        <g transform={onTop(PLINTH)} className={body.ink}>
          <path d="M-20 0 A20 20 0 1 0 20 0 A20 20 0 1 0 -20 0 Z M-17 0 A17 17 0 1 1 17 0 A17 17 0 1 1 -17 0 Z" fillRule="evenodd" />
        </g>
        <RoundBlock shape={cylinder(0, 0, PLINTH, COLLAR - PLINTH, 11)} paint={body} />
        <RoundBlock shape={cylinder(0, 0, COLLAR, SCREW - COLLAR, 9)} paint={body} />
        {RIDGES.map((z) => (
          <polygon key={z} points={band(9.1, z, 1.6)} className={body.ink} />
        ))}
        <g className={body.edge} strokeWidth={1} strokeLinejoin="round">
          <path d={GLASS} className={body.base} />
        </g>
        <g clipPath={`url(#${clipId})`}>
          <rect x={-GLOBE.r} y={GLOBE.y - GLOBE.r} width={GLOBE.r} height={GLOBE.r * 2 + 40} className={body.left} />
          <rect x={0} y={GLOBE.y - GLOBE.r} width={GLOBE.r} height={GLOBE.r * 2 + 40} className={body.right} />
        </g>
        <path d={FILAMENT} fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={wire(body.ink)} />
        <g className="isometric107-lit isometric107-rest opacity-0">
          <path d={GLASS} strokeWidth={1} className={cn(lit.base, lit.edge)} />
          <g clipPath={`url(#${clipId})`}>
            <rect x={0} y={GLOBE.y - GLOBE.r} width={GLOBE.r} height={GLOBE.r * 2 + 40} className={lit.left} />
          </g>
          <path d={FILAMENT} fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={wire(lit.ink)} />
        </g>
        <path d={`M${-GLOBE.r + 9} ${GLOBE.y - 6} A${GLOBE.r - 9} ${GLOBE.r - 9} 0 0 1 ${-6} ${GLOBE.y - GLOBE.r + 9}`} fill="none" strokeWidth={3} strokeLinecap="round" className="stroke-white/50" />
      </svg>
    </div>
  );
}
