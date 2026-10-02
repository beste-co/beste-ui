"use client";

import { useId } from "react";
import type { ReactNode } from "react";
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

interface Isometric114Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the delivery box with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric114Demo: Isometric114Props = {
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
const ROAD = box(-4, 0, 0, 128, 60, G);
const LANE = 50;
const DASH = 24;
const R = 12;
const HUB = G + R;
const WHEELS = [28, 98];
const Y0 = 22;
const Y1 = 34;
const TIRE: [number, number] = [25, 31];
// The markings are drawn on the road plane, so they slide back along x in road units
const SHIFT = `translateX(${-2 * DASH}px)`;
// Side profile in (x, -z): rear cowl, low deck, leaning front column, fender
const COWL = `M10 ${-(G + 14)} H54 Q60 ${-(G + 14)} 60 ${-(G + 22)} Q60 ${-(G + 36)} 46 ${-(G + 36)} H20 Q6 ${-(G + 36)} 6 ${-(G + 24)} Q6 ${-(G + 14)} 10 ${-(G + 14)} Z`;
const DECK = `M56 ${-(G + 10)} H84 V${-(G + 16)} H56 Z`;
const COLUMN = `M78 ${-(G + 10)} H88 L96 ${-(G + 50)} H86 Z`;
const FENDER = `M86 ${-(G + 22)} Q98 ${-(G + 30)} 110 ${-(G + 22)} V${-(G + 19)} Q98 ${-(G + 26)} 86 ${-(G + 19)} Z`;
const HEAD = `M84 ${-(G + 48)} H98 Q102 ${-(G + 48)} 102 ${-(G + 52)} V${-(G + 54)} Q102 ${-(G + 58)} 98 ${-(G + 58)} H86 Q82 ${-(G + 58)} 82 ${-(G + 54)} Z`;
const SEAT = `M30 ${-(G + 36)} H58 V${-(G + 39)} Q58 ${-(G + 42)} 54 ${-(G + 42)} H34 Q30 ${-(G + 42)} 30 ${-(G + 39)} Z`;
const SCOOTER = [COWL, DECK, COLUMN, FENDER, HEAD];

const STYLES = `
@keyframes isometric114-spin { to { transform: rotate(360deg); } }
@keyframes isometric114-road { to { transform: ${SHIFT}; } }
@keyframes isometric114-ride { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1px); } }
.isometric114-spin { transform-box: fill-box; transform-origin: center; animation: isometric114-spin 3.14s linear infinite; }
.isometric114-road { animation: isometric114-road 2s linear infinite; }
.isometric114-ride { animation: isometric114-ride 1.3s ease-in-out infinite; }
.isometric114-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric114-spin, .isometric114-road, .isometric114-ride { animation: none; } }
`;

/** A flat side profile pushed out along y, drawn as stacked layers with a shaded front. */
function Extrude({ from, to, paint, children }: { from: number; to: number; paint: Paint; children: (className: string) => ReactNode }) {
  const layers = Array.from({ length: Math.round(to - from) }, (_, k) => from + k);
  return (
    <g>
      {layers.map((y, index) => (
        <g key={y} transform={onLeft(y)} className={index === 0 ? paint.edge : undefined} strokeWidth={index === 0 ? 1 : 0}>
          {children(paint.base)}
          {children(paint.right)}
        </g>
      ))}
      <g transform={onLeft(to)} className={paint.edge} strokeWidth={1} strokeLinejoin="round">
        {children(paint.base)}
        <g stroke="none">{children(paint.left)}</g>
      </g>
    </g>
  );
}

export function Isometric114({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric114Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const shapes = (paths: string[]) => (fill: string) => paths.map((d) => <path key={d} d={d} vectorEffect="non-scaling-stroke" className={fill} />);

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric114-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-62 -64 174 160" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <polygon points={ROAD.top} />
          </clipPath>
        </defs>
        <Block faces={ROAD} paint={body} />
        <g clipPath={`url(#${clipId})`}>
          <g transform={onTop(G)} className={body.ink}>
            <g className="isometric114-road">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                <rect key={index} x={index * DASH - 4} y={LANE} width={12} height={4} rx={1} />
              ))}
            </g>
          </g>
        </g>
        <g className="isometric114-ride">
          <Extrude from={Y0} to={TIRE[0]} paint={body}>{shapes(SCOOTER)}</Extrude>
          {WHEELS.map((x) => (
            <g key={x}>
              <Extrude from={TIRE[0]} to={TIRE[1]} paint={body}>
                {(fill) => <circle cx={x} cy={-HUB} r={R} vectorEffect="non-scaling-stroke" className={fill} />}
              </Extrude>
              <g transform={onLeft(TIRE[1])} className={body.ink}>
                <circle cx={x} cy={-HUB} r={R - 4} />
              </g>
              <g transform={onLeft(TIRE[1])} className={body.base}>
                <g className="isometric114-spin">
                  <circle cx={x} cy={-HUB} r={R - 5} className="fill-transparent" />
                  <circle cx={x} cy={-HUB} r={2.5} />
                  {[0, 120, 240].map((angle) => (
                    <rect key={angle} x={x - 1} y={-HUB - R + 5} width={2} height={R - 5} rx={1} transform={`rotate(${angle} ${x} ${-HUB})`} />
                  ))}
                </g>
              </g>
            </g>
          ))}
          <Extrude from={TIRE[0]} to={Y1} paint={body}>{shapes(SCOOTER)}</Extrude>
          <g transform={onLeft(Y1)} className={body.ink}>
            <rect x={20} y={-(G + 27)} width={30} height={3} rx={1.5} />
            <circle cx={99} cy={-(G + 53)} r={2.5} />
          </g>
          <Block faces={box(4, Y0 - 3, G + 36, 28, 18, 2)} paint={body} />
          <Block faces={box(6, Y0 - 3, G + 38, 24, 18, 24)} paint={paint.accent} />
          <g transform={onLeft(Y1 + 1)} className={paint.accent.ink}>
            <rect x={10} y={-(G + 54)} width={16} height={4} rx={2} />
          </g>
          <g transform={onRight(30)} className={paint.accent.ink}>
            <rect x={Y0 + 3} y={-(G + 54)} width={10} height={4} rx={2} />
          </g>
          <Extrude from={Y0 + 1} to={Y1 - 1} paint={body}>{shapes([SEAT])}</Extrude>
          <RodBlock shape={rod("y", Y0 - 7, Y1 + 7, 90, G + 58, 2.5)} paint={body} />
        </g>
      </svg>
    </div>
  );
}
