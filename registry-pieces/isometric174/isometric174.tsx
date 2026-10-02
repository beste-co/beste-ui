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

interface Isometric174Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the coffee with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric174Demo: Isometric174Props = {
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

const W = 64;
const BACK = 28;
const TRAY = { d: 34, h: 10 };
const HEAD = { z: 58, d: 52, h: 26 };
const TOP = HEAD.z + HEAD.h;
// The cup stands under the group head
const CUP = { x: 32, y: 40, r: 8, h: 16 };
const FLOOR = TRAY.h + 1;
const FULL = 11;
const SPOUT = 46;
const POUR = SPOUT - FLOOR;
const SLIDE = 22;
const PERIOD = 8;
const GAUGE = { x: 46, z: 71, r: 8 };
const REST = -120;

/** Move to the plan point (x, y) on the ground. */
const at = (x: number, y: number) => `translate(${((x - y) * C).toFixed(1)} ${((x + y) * S).toFixed(1)})`;
const RX = CUP.r * C * Math.SQRT2;
const RY = CUP.r * S * Math.SQRT2;
const GLASS = `M${-RX} ${-TRAY.h - CUP.h}V${-TRAY.h}A${RX} ${RY} 0 0 0 ${RX} ${-TRAY.h}V${-TRAY.h - CUP.h}A${RX} ${RY} 0 0 0 ${-RX} ${-TRAY.h - CUP.h}Z`;
const slide = (x: number) => `translate(${(x * C).toFixed(1)}px, ${(x * S).toFixed(1)}px)`;

const STYLES = `
@keyframes isometric174-stream { 0%, 8% { stroke-dashoffset: ${POUR}; } 11%, 56% { stroke-dashoffset: 0; } 59%, 100% { stroke-dashoffset: ${-POUR}; } }
@keyframes isometric174-fill { 0%, 10.9% { transform: translateY(${FULL}px); opacity: 0; } 11% { transform: translateY(${FULL}px); opacity: 1; } 58%, 90% { transform: translateY(0px); opacity: 1; } 90.1%, 100% { transform: translateY(${FULL}px); opacity: 0; } }
@keyframes isometric174-cup { 0%, 84% { transform: ${slide(0)}; opacity: 1; } 90% { transform: ${slide(SLIDE)}; opacity: 0; } 90.1% { transform: ${slide(-SLIDE)}; opacity: 0; } 97%, 100% { transform: ${slide(0)}; opacity: 1; } }
@keyframes isometric174-needle { 0%, 6% { transform: rotate(${REST}deg); } 11% { transform: rotate(48deg); } 14% { transform: rotate(36deg); } 26% { transform: rotate(42deg); } 40% { transform: rotate(37deg); } 56% { transform: rotate(40deg); } 64%, 100% { transform: rotate(${REST}deg); } }
.isometric174-stream { animation: isometric174-stream ${PERIOD}s linear infinite; }
.isometric174-fill { animation: isometric174-fill ${PERIOD}s linear infinite; }
.isometric174-cup { animation: isometric174-cup ${PERIOD}s ease-in-out infinite; }
.isometric174-needle { animation: isometric174-needle ${PERIOD}s ease-in-out infinite; }
.isometric174-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric174-stream, .isometric174-fill, .isometric174-cup, .isometric174-needle { animation: none; } }
`;

export function Isometric174({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric174Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const glassId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const coffee = paint.accent;
  const flow = !accent ? body.ink.replace("fill-", "stroke-") : palette === "tone" ? "stroke-white" : "stroke-current";
  const inkStroke = body.ink.replace("fill-", "stroke-");

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric174-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-58 -88 118 156" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={glassId}>
            <path d={GLASS} transform={at(CUP.x, CUP.y)} />
          </clipPath>
        </defs>
        <Block faces={box(0, 0, 0, W, BACK, HEAD.z)} paint={body} />
        <Block faces={box(0, BACK, 0, W, TRAY.d, TRAY.h)} paint={body} />
        <g transform={onTop(TRAY.h)} className={body.ink}>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <rect key={index} x={8 + index * 9} y={BACK + 5} width={3} height={TRAY.d - 10} rx={1.5} />
          ))}
        </g>
        <g transform={at(CUP.x, CUP.y)}>
          <RoundBlock shape={cylinder(0, 0, SPOUT + 3, 5, 8)} paint={body} />
          <RoundBlock shape={cylinder(0, 0, SPOUT, 3, 2.5)} paint={body} />
          <line x1={0} y1={-SPOUT} x2={0} y2={-FLOOR} strokeWidth={2} strokeDasharray={`${POUR} ${POUR}`} className={cn("isometric174-stream", flow)} />
        </g>
        <g className="isometric174-cup">
          <path d={GLASS} transform={at(CUP.x, CUP.y)} className={body.ink} />
          <g clipPath={`url(#${glassId})`}>
            <g className="isometric174-fill">
              <g transform={at(CUP.x, CUP.y)}>
                <RoundBlock shape={cylinder(0, 0, FLOOR - 6, FULL + 6, CUP.r - 1)} paint={coffee} />
              </g>
            </g>
          </g>
          <g transform={at(CUP.x, CUP.y)}>
            <path d={GLASS} strokeWidth={1} vectorEffect="non-scaling-stroke" className={cn("fill-transparent", body.edge)} />
            <ellipse cy={-TRAY.h - CUP.h} rx={RX} ry={RY} strokeWidth={1} vectorEffect="non-scaling-stroke" className={cn("fill-transparent", body.edge)} />
          </g>
        </g>
        <Block faces={box(CUP.x - 2, CUP.y + 8, SPOUT + 4, 4, 20, 4)} paint={body} />
        <Block faces={box(CUP.x - 3, CUP.y + 26, SPOUT + 3, 6, 5, 6)} paint={body} />
        <Block faces={box(0, 0, HEAD.z, W, HEAD.d, HEAD.h)} paint={body} />
        <g transform={onTop(TOP)} fill="none" strokeWidth={2} className={inkStroke}>
          <rect x={8} y={8} width={W - 16} height={HEAD.d - 16} rx={3} />
        </g>
        <g transform={onLeft(HEAD.d)}>
          <g className={body.ink}>
            <circle cx={12} cy={-GAUGE.z} r={3} />
            <circle cx={22} cy={-GAUGE.z} r={3} />
            <rect x={9} y={-HEAD.z - 6} width={16} height={2} rx={1} />
          </g>
          <circle cx={GAUGE.x} cy={-GAUGE.z} r={GAUGE.r} strokeWidth={1} vectorEffect="non-scaling-stroke" className={cn(body.base, body.edge)} />
          <path d={`M${GAUGE.x} ${-GAUGE.z - GAUGE.r + 2}A${GAUGE.r - 2} ${GAUGE.r - 2} 0 0 1 ${GAUGE.x + GAUGE.r - 2} ${-GAUGE.z}`} fill="none" strokeWidth={2} strokeLinecap="round" className={flow} />
          <g transform={`translate(${GAUGE.x} ${-GAUGE.z})`}>
            <g className="isometric174-needle" transform="rotate(40)">
              <rect x={-0.8} y={-GAUGE.r + 2.5} width={1.6} height={GAUGE.r - 2.5} rx={0.8} className={palette === "dark" ? "fill-white/70" : palette === "tone" ? "fill-black/60" : "fill-foreground/60"} />
            </g>
            <circle r={1.6} className={palette === "dark" ? "fill-white/70" : palette === "tone" ? "fill-black/60" : "fill-foreground/60"} />
          </g>
        </g>
      </svg>
    </div>
  );
}
