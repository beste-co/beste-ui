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

interface Isometric146Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Light the roof sign with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric146Demo: Isometric146Props = {
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

const G = 8;
const WALK = 12;
const L = 88;
const D = 36;
const CAR = roundBox(0, 0, G + 6, L, D, 16, 8);
const CABIN = roundBox(20, 3, G + 22, 44, 30, 14, 8);
const WHEELS = [19, 69];
const SIGN = box(32, 12, G + 36, 20, 12, 9);
const CHECKS = Array.from({ length: 13 }, (_, index) => index);
// The taxi stays in frame; the lane markings slide back, slow to a stop and move off again
const PITCH = 30;

const STYLES = `
@keyframes isometric146-road { 0% { transform: translateX(0); animation-timing-function: cubic-bezier(0.2, 0.6, 0.4, 1); } 30%, 78% { transform: translateX(${-4 * PITCH}px); animation-timing-function: cubic-bezier(0.6, 0, 0.8, 0.4); } 100% { transform: translateX(${-7 * PITCH}px); } }
@keyframes isometric146-sign { 0%, 34% { opacity: 0; } 38%, 41% { opacity: 1; } 43% { opacity: 0.3; } 46%, 72% { opacity: 1; } 76%, 100% { opacity: 0; } }
.isometric146-road { animation: isometric146-road 5.6s linear infinite; }
.isometric146-sign { animation: isometric146-sign 5.6s linear infinite; }
.isometric146-still * { animation: none !important; }
.isometric146-still .isometric146-rest { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .isometric146-road, .isometric146-sign { animation: none; } .isometric146-rest { opacity: 1; } }
`;

function Wheel({ x, y, paint }: { x: number; y: number; paint: Paint }) {
  return (
    <g className={paint.edge} strokeWidth={1}>
      <g transform={onLeft(y - 4)}>
        <circle cx={x} cy={-G - 9} r={9} className={paint.base} vectorEffect="non-scaling-stroke" />
        <circle cx={x} cy={-G - 9} r={9} className={paint.left} stroke="none" />
      </g>
      <g transform={onLeft(y)}>
        <circle cx={x} cy={-G - 9} r={9} className={paint.base} vectorEffect="non-scaling-stroke" />
        <circle cx={x} cy={-G - 9} r={4} className={paint.ink} stroke="none" />
      </g>
    </g>
  );
}

function Sign({ paint, text }: { paint: Paint; text: string }) {
  return (
    <>
      <Block faces={SIGN} paint={paint} />
      <g transform={onLeft(24)}>
        <text x={42} y={-(G + 40.5)} textAnchor="middle" dominantBaseline="central" fontSize={6.5} letterSpacing={0.8} className={cn("font-semibold", text)}>
          TAXI
        </text>
      </g>
    </>
  );
}

export function Isometric146({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric146Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const lit = palette === "tone" ? "fill-current" : "fill-white";

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric146-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-58 -40 176 128" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <polygon points={box(-8, -20, 0, 112, 68, G).top} />
          </clipPath>
        </defs>
        <Block faces={box(-8, -20, 0, 112, 68, G)} paint={body} />
        <Block faces={box(-8, -20, G, 112, 14, WALK - G)} paint={body} />
        <g transform={onTop(G)} className={body.ink}>
          <rect x={-8} y={-4} width={112} height={2} />
        </g>
        <g clipPath={`url(#${clipId})`}>
          <g transform={onTop(G)} className={body.ink}>
            <g className="isometric146-road">
              {Array.from({ length: 12 }, (_, index) => (
                <rect key={index} x={-4 + index * PITCH} y={42} width={18} height={2} rx={1} />
              ))}
            </g>
          </g>
        </g>
        <g>
          {WHEELS.map((x) => (
            <Wheel key={x} x={x} y={4} paint={body} />
          ))}
          <RoundBlock shape={CAR} paint={body} />
          <RoundBlock shape={CABIN} paint={body} />
          <g transform={onLeft(D - 3)} className={body.ink}>
            <rect x={26} y={-G - 34} width={18} height={9} rx={2} />
            <rect x={47} y={-G - 34} width={14} height={9} rx={2} />
          </g>
          <g transform={onRight(64)} className={body.ink}>
            <rect x={10} y={-G - 34} width={16} height={9} rx={2} />
          </g>
          <g transform={onLeft(D)} className={body.ink}>
            {CHECKS.map((index) => (
              <rect key={index} x={14 + index * 4} y={-G - 18 + (index % 2) * 3} width={4} height={3} />
            ))}
            <rect x={45} y={-G - 21} width={1} height={14} />
          </g>
          <g transform={onRight(L)} className={body.ink}>
            <rect x={6} y={-G - 16} width={6} height={3} rx={1.5} />
            <rect x={24} y={-G - 16} width={6} height={3} rx={1.5} />
            <rect x={13} y={-G - 12} width={10} height={3} rx={1} />
          </g>
          <Sign paint={body} text={body.ink} />
          <g className="isometric146-sign isometric146-rest opacity-0">
            <Sign paint={paint.accent} text={accent ? lit : body.ink} />
          </g>
          {WHEELS.map((x) => (
            <Wheel key={x} x={x} y={D} paint={body} />
          ))}
        </g>
      </svg>
    </div>
  );
}
