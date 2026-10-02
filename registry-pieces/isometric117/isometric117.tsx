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

interface Isometric117Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the water with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric117Demo: Isometric117Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

// A circle of radius r in plan projects to an ellipse with these radii
const ELLIPSE_X = C * Math.SQRT2;
const ELLIPSE_Y = S * Math.SQRT2;

/** An upright cylinder centered on the origin in plan, shaded in two halves like a box. */
function Cylinder({ r, z, h, paint }: { r: number; z: number; h: number; paint: Paint }) {
  const rx = r * ELLIPSE_X;
  const ry = r * ELLIPSE_Y;
  const top = -z - h;
  const bottom = -z;
  const left = `M${-rx} ${top} L${-rx} ${bottom} A${rx} ${ry} 0 0 0 0 ${bottom + ry} L0 ${top + ry} A${rx} ${ry} 0 0 1 ${-rx} ${top} Z`;
  const right = `M${rx} ${top} L${rx} ${bottom} A${rx} ${ry} 0 0 1 0 ${bottom + ry} L0 ${top + ry} A${rx} ${ry} 0 0 0 ${rx} ${top} Z`;
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <path d={left} className={paint.base} />
      <path d={left} className={paint.left} stroke="none" />
      <path d={right} className={paint.base} />
      <path d={right} className={paint.right} stroke="none" />
      <ellipse cx={0} cy={top} rx={rx} ry={ry} className={paint.base} />
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

const T = 14;
const COUNTER = box(0, 0, 0, 88, 76, T);
const SINK = { x0: 14, x1: 74, y0: 24, y1: 66, depth: 10 };
const FLOOR = T - SINK.depth;
const HOLE = polygon([[SINK.x0, SINK.y0, T], [SINK.x1, SINK.y0, T], [SINK.x1, SINK.y1, T], [SINK.x0, SINK.y1, T]]);
const BACK_WALL = polygon([[SINK.x0, SINK.y0, T], [SINK.x1, SINK.y0, T], [SINK.x1, SINK.y0, FLOOR], [SINK.x0, SINK.y0, FLOOR]]);
const SIDE_WALL = polygon([[SINK.x0, SINK.y0, T], [SINK.x0, SINK.y1, T], [SINK.x0, SINK.y1, FLOOR], [SINK.x0, SINK.y0, FLOOR]]);
const BASIN = polygon([[SINK.x0, SINK.y0, FLOOR], [SINK.x1, SINK.y0, FLOOR], [SINK.x1, SINK.y1, FLOOR], [SINK.x0, SINK.y1, FLOOR]]);
const GX = 44;
const GY = 44;
const GR = 10;
const GH = 26;
const FULL = 18;
const TAP = { y: 10, top: T + 40 };
const at = (x: number, y: number) => `translate(${project([x, y, 0])})`;
const RX = GR * ELLIPSE_X;
const RY = GR * ELLIPSE_Y;
const GLASS = `M${-RX} ${-(FLOOR + GH)} L${-RX} ${-FLOOR} A${RX} ${RY} 0 0 0 ${RX} ${-FLOOR} L${RX} ${-(FLOOR + GH)} A${RX} ${RY} 0 0 0 ${-RX} ${-(FLOOR + GH)} Z`;
const FALL = TAP.top - 8 - (FLOOR + GH);

const STYLES = `
@keyframes isometric117-fill { 0%, 6% { transform: translateY(${FULL}px); opacity: 1; } 76%, 90% { transform: translateY(0); opacity: 1; } 98% { transform: translateY(0); opacity: 0; } 100% { transform: translateY(${FULL}px); opacity: 0; } }
@keyframes isometric117-drop { 0% { transform: translateY(0); opacity: 0; } 4% { opacity: 1; } 20% { transform: translateY(${FALL}px); opacity: 1; } 22%, 100% { transform: translateY(${FALL}px); opacity: 0; } }
.isometric117-fill { animation: isometric117-fill 6s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
.isometric117-drop { animation: isometric117-drop 1.5s cubic-bezier(0.55, 0, 1, 0.6) infinite; }
.isometric117-still * { animation: none !important; }
.isometric117-still .isometric117-drop { opacity: 0; }
@media (prefers-reduced-motion: reduce) { .isometric117-fill, .isometric117-drop { animation: none; } .isometric117-drop { opacity: 0; } }
`;

export function Isometric117({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric117Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const holeId = useId();
  const glassId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const water = paint.accent;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric117-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-70 -46 150 134" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={holeId}>
            <polygon points={HOLE} />
          </clipPath>
          <clipPath id={glassId}>
            <path d={GLASS} transform={at(GX, GY)} />
          </clipPath>
        </defs>
        <Block faces={COUNTER} paint={body} />
        <g clipPath={`url(#${holeId})`} className={body.edge} strokeWidth={1} strokeLinejoin="round">
          <polygon points={BASIN} className={body.base} />
          <polygon points={BASIN} className={body.right} stroke="none" />
          <polygon points={BACK_WALL} className={body.base} />
          <polygon points={BACK_WALL} className={body.left} stroke="none" />
          <polygon points={SIDE_WALL} className={body.base} />
          <polygon points={SIDE_WALL} className={body.right} stroke="none" />
          <g transform={onTop(FLOOR)} className={body.ink}>
            <circle cx={26} cy={56} r={3} />
          </g>
        </g>
        <g transform={at(GX, TAP.y)}>
          <Cylinder r={6} z={T} h={3} paint={body} />
          <Cylinder r={3.5} z={T + 3} h={TAP.top - T - 3} paint={body} />
        </g>
        <Block faces={box(GX - 2, TAP.y - 14, TAP.top + 2, 4, 14, 3)} paint={body} />
        <g transform={at(GX, TAP.y)}>
          <Cylinder r={4.5} z={TAP.top - 1} h={4} paint={body} />
        </g>
        <path d={GLASS} transform={at(GX, GY)} className={body.ink} />
        <g clipPath={`url(#${glassId})`}>
          <g className="isometric117-fill">
            <g transform={at(GX, GY)}>
              <Cylinder r={GR - 1} z={FLOOR + 1 - 4} h={FULL + 4} paint={water} />
            </g>
          </g>
        </g>
        <g transform={at(GX, GY)}>
          <path d={GLASS} strokeWidth={1} vectorEffect="non-scaling-stroke" className={cn("fill-transparent", body.edge)} />
          <ellipse cy={-(FLOOR + GH)} rx={RX} ry={RY} strokeWidth={1} vectorEffect="non-scaling-stroke" className={cn("fill-transparent", body.edge)} />
        </g>
        <RodBlock shape={rod("y", TAP.y, GY, GX, TAP.top - 3, 3.5)} paint={body} />
        <g transform={at(GX, GY)}>
          <Cylinder r={2.5} z={TAP.top - 10} h={4} paint={body} />
          <g className="isometric117-drop">
            <path d={`M0 ${-(TAP.top - 14)} q2.6 3.6 0 5.2 q-2.6 -1.6 0 -5.2Z`} className={water.base} />
          </g>
        </g>
      </svg>
    </div>
  );
}
